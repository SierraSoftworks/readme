export function openAPIResolve<T>(doc: OpenAPIDoc, entry: T | OpenAPIReference): T {
    if (!isRef(entry))
        return entry

    const parts = entry.$ref.split("/")

    if (!doc[parts[1]]) return null
    if (!doc[parts[1]][parts[2]]) return null
    return doc[parts[1]][parts[2]][parts[3]] || null
}

function isRef(item: any): item is OpenAPIReference {
    if (!item) return false
    return !!item.$ref
}

export function openAPIExample(doc: OpenAPIDoc, schema: OpenAPISchema | OpenAPIReference): any {
    const resolved = openAPIResolve(doc, schema)
    if (resolved.example) return resolved.example

    switch (resolved.type) {
        case "array":
            return [openAPIExample(doc, resolved.items)].filter(x => typeof x !== "undefined")
        case "object":
            return Object.assign({}, ...Object.keys(resolved.properties).map(k => {
                const example = openAPIExample(doc, resolved.properties[k])
                if (!example) return {}
                return { [k]: example }
            }))
    }

    return undefined
}

export class OpenAPIVisitor {
    visit(doc: OpenAPIDoc): OpenAPIDoc {
        return this.objVisitMap(doc, {
            openapi: v => v,
            info: this.visitInfo,
            paths: v => this.objVisit(v, (vv) => this.visitPath(vv)),
            components: c => this.objVisitMap(c, {
                schemas: v => this.objVisit(v, vv => this.visitSchema(vv)),
                responses: v => this.objVisit(v, vv => this.visitResponse(vv)),
                parameters: v => this.objVisit(v, vv => this.visitParameter(vv)),
                examples: v => this.objVisit(v, vv => this.visitExample(vv)),
                requestBodies: v => this.objVisit(v, vv => this.visitRequestBody(vv)),
                headers: v => this.objVisit(v, vv => this.visitHeader(vv)),
                links: v => this.objVisit(v, vv => this.visitLink(vv)),
                callbacks: v => this.objVisit(v, vv => this.visitCallback(vv)),
                securitySchemes: v => this.objVisit(v, vv => this.visitSecurityScheme(vv)),
            }),

            externalDocs: v => this.visitExternalDocs(v),
            servers: v => v.map(vv => this.visitServer(vv)),
            security: v => this.visitSecurityRequirement(v),
            tags: v => v.map(vv => this.visitTag(vv))
        })
    }

    protected visitInfo(info: OpenAPIMetadata): OpenAPIMetadata {
        return info
    }

    protected visitPath(path: OpenIDPathItem): OpenIDPathItem {
        return this.objVisitMap(path, {
            get: v => this.visitEndpoint(v),
            post: v => this.visitEndpoint(v),
            put: v => this.visitEndpoint(v),
            delete: v => this.visitEndpoint(v),
            options: v => this.visitEndpoint(v),
            patch: v => this.visitEndpoint(v),
            trace: v => this.visitEndpoint(v),
            head: v => this.visitEndpoint(v),
            parameters: (params) => params.map(p => this.visitParameter(p)),
            servers: servers => servers.map(s => this.visitServer(s)),
        })
    }

    protected visitServer(server: OpenAPIServer): OpenAPIServer {
        return server
    }

    protected visitEndpoint(endpoint: OpenAPIEndpoint): OpenAPIEndpoint {
        return this.objVisitMap(endpoint, {
            requestBody: v => this.visitRequestBody(v),
            parameters: v => v.map(vv => this.visitParameter(vv)),
            responses: v => this.objVisit(v, vv => this.visitResponse(vv)),
            servers: v => v.map(vv => this.visitServer(vv)),
            callbacks: v => this.objVisit(v, vv => this.visitCallback(vv)),
            security: v => v.map(vv => this.visitSecurityRequirement(vv)),
            externalDocs: v => this.visitExternalDocs(v)
        })
    }

    protected visitSchema(schema: OpenAPISchema | OpenAPIReference): OpenAPISchema | OpenAPIReference {
        return this.objVisitMapRef(schema, {
            properties: v => this.objVisit(v, vv => this.visitSchema(vv)),
            items: v => this.visitSchema(v),
        }, r => this.visitReference(r))
    }

    protected visitResponse(response: OpenAPIResponse | OpenAPIReference): OpenAPIResponse | OpenAPIReference {
        return this.objVisitMapRef(response, {
            description: (v: string) => v,
            content: v => this.objVisit(v, vv => this.visitMediaType(vv)),
            headers: v => this.objVisit(v, vv => this.visitHeader(vv)),
            links: v => this.objVisit(v, vv => this.visitLink(vv))
        }, r => this.visitReference(r))
    }

    protected visitMediaType(media: OpenAPIMediaType): OpenAPIMediaType {
        return this.objVisitMap(media, {
            schema: v => this.visitSchema(v),
            examples: v => this.objVisit(v, vv => this.visitExample(vv)),
            encoding: v => this.objVisit(v, vv => this.visitEncoding(vv))
        })
    }

    protected visitParameter(parameter: OpenAPIParameter | OpenAPIReference): OpenAPIParameter | OpenAPIReference {
        return this.objVisitMapRef(parameter, {
            name: v => v,
            in: v => v,
            schema: v => this.visitSchema(v),
            examples: v => this.objVisit(v, vv => this.visitExample(vv))
        }, r => this.visitReference(r))
    }

    protected visitExample(example: OpenAPIExample | OpenAPIReference): OpenAPIExample | OpenAPIReference {
        if (isRef(example)) return this.visitReference(example)
        return example
    }

    protected visitRequestBody(request: OpenAPIRequestBody | OpenAPIReference): OpenAPIRequestBody | OpenAPIReference {
        return this.objVisitMapRef(request, {
            content: v => this.objVisit(v, vv => this.visitMediaType(vv))
        }, r => this.visitReference(r))
    }

    protected visitHeader(header: OpenAPIHeader | OpenAPIReference): OpenAPIHeader | OpenAPIReference {
        return this.objVisitMapRef(header, {
            schema: v => this.visitSchema(v),
            examples: v => this.objVisit(v, vv => this.visitExample(vv))
        }, r => this.visitReference(r))
    }

    protected visitLink(link: OpenAPILink | OpenAPIReference): OpenAPILink | OpenAPIReference {
        return this.objVisitMapRef(link, {
            server: v => this.visitServer(v)
        }, r => this.visitReference(r))
    }

    protected visitCallback(callback: OpenAPICallback | OpenAPIReference): OpenAPICallback | OpenAPIReference {
        if (isRef(callback)) return callback
        return this.objVisit(callback, v => this.visitPath(v))
    }

    protected visitSecurityScheme(scheme: OpenAPISecurityScheme | OpenAPIReference): OpenAPISecurityScheme | OpenAPIReference {
        if (isRef(scheme)) return this.visitReference(scheme)
        return scheme
    }

    protected visitSecurityRequirement(requirement: OpenAPISecurityRequirement): OpenAPISecurityRequirement {
        return requirement
    }

    protected visitExternalDocs(docs: OpenAPIExternalDocumentation): OpenAPIExternalDocumentation {
        return docs
    }

    protected visitTag(tag: OpenAPITag): OpenAPITag {
        return this.objVisitMap(tag, {
            name: v => v,
            externalDocs: v => this.visitExternalDocs(v),
        })
    }

    protected visitEncoding(encoding: OpenAPIEncoding): OpenAPIEncoding {
        return this.objVisitMap(encoding, {
            headers: v => this.objVisit(v, vv => this.visitHeader(vv))
        })
    }

    protected visitReference<T>(ref: T | OpenAPIReference): T | OpenAPIReference {
        return ref
    }

    private objVisit<Input, TKey extends keyof Input>(obj: Input, transform: (value: Input[TKey], key: TKey) => Input[TKey]): Input {
        return Object.assign({}, ...Object.keys(obj).map(k => ({ [k]: transform(obj[k], <TKey>k) })))
    }

    private objVisitMapRef<Input>(obj: Input | OpenAPIReference, transforms: { [TKey in keyof Input]: (value: Input[TKey], key: TKey) => Input[TKey] }, onRef: (ref: OpenAPIReference) => Input | OpenAPIReference = null): Input | OpenAPIReference {
        if (isRef(obj) && onRef) return onRef(obj)
        else if (isRef(obj)) return obj
        return this.objVisitMap(obj, transforms)
    }

    private objVisitMap<Input>(obj: Input, transforms: { [TKey in keyof Input]: (value: Input[TKey], key: TKey) => Input[TKey] }): Input {
        return Object.assign({}, obj, ...Object.keys(obj).map(k => ({ [k]: transforms[k] ? transforms[k](obj[k], k) : obj[k] })))
    }
}

export interface OpenAPIDoc {
    openapi: "3.0.0" | "3.0.1" | "3.0.2"

    info: OpenAPIMetadata

    paths: {
        [path: string]: OpenIDPathItem
    }

    components?: OpenAPIComponents

    externalDocs?: OpenAPIExternalDocumentation
    security?: OpenAPISecurityRequirement
    servers?: OpenAPIServer[]
    tags?: OpenAPITag[]
}

export interface OpenAPIMetadata {
    title: string
    description?: string
    termsOfService?: string
    version?: string
    contact?: {
        name?: string
        url?: string
        email?: string
    }
    license?: {
        name: string
        url?: string
    }
}

export interface OpenAPIServer {
    url: string
    description?: string
    variables?: {
        [variable: string]: {
            default: string
            description?: string
            enum?: string[]
        }
    }
}

export interface OpenIDPathItem {
    summary?: string
    description?: string

    get?: OpenAPIEndpoint
    put?: OpenAPIEndpoint
    post?: OpenAPIEndpoint
    delete?: OpenAPIEndpoint
    options?: OpenAPIEndpoint
    head?: OpenAPIEndpoint
    patch?: OpenAPIEndpoint
    trace?: OpenAPIEndpoint
    servers?: OpenAPIServer[]
    parameters?: (OpenAPIParameter | OpenAPIReference)[]
}

export interface OpenAPIComponents {
    schemas?: {
        [name: string]: OpenAPISchema | OpenAPIReference
    }
    responses?: {
        [name: string]: OpenAPIResponse | OpenAPIReference
    }
    parameters?: {
        [name: string]: OpenAPIParameter | OpenAPIReference
    }
    examples?: {
        [name: string]: OpenAPIExample | OpenAPIReference
    }
    requestBodies?: {
        [name: string]: OpenAPIRequestBody | OpenAPIReference
    }
    headers?: {
        [name: string]: OpenAPIHeader | OpenAPIReference
    }
    links?: {
        [name: string]: OpenAPILink | OpenAPIReference
    }
    callbacks?: {
        [name: string]: OpenAPICallback | OpenAPIReference
    }
    securitySchemes?: {
        [name: string]: OpenAPISecurityScheme | OpenAPIReference
    }
}

export interface OpenAPITag {
    name: string
    description?: string
    externalDocs?: OpenAPIExternalDocumentation
}

export interface OpenAPIEndpoint {
    tags?: string[]
    summary?: string
    description?: string
    externalDocs?: OpenAPIExternalDocumentation
    operationId?: string
    parameters?: (OpenAPIParameter | OpenAPIReference)[]
    requestBody?: OpenAPIRequestBody | OpenAPIReference
    responses: {
        default: OpenAPIResponse | OpenAPIReference
        [key: number]: OpenAPIResponse | OpenAPIReference
    }
    callbacks?: {
        [name: string]: OpenAPICallback | OpenAPIReference
    }
    deprecated?: boolean
    security?: OpenAPISecurityRequirement[]
    servers?: OpenAPIServer[]
}

export interface OpenAPISchema {
    [field: string]: any
    type?: "object" | "number" | "integer" | "array" | "string" | "boolean"
    properties?: {
        [name: string]: OpenAPISchema | OpenAPIReference
    }
    items?: OpenAPISchema | OpenAPIReference
    enum?: string[]
    nullable?: boolean
    readOnly?: boolean
    writeOnly?: boolean
    example?: any
    deprecated?: boolean
    xml?: {
        name?: string
        attribute?: boolean
        wrapped?: boolean
        prefix?: string
        namespace?: string
    }
}

export interface OpenAPIReference {
    $ref: string
}

export interface OpenAPIParameter {
    name: string
    in: "query" | "header" | "path" | "cookie"
    description?: string
    required?: boolean
    deprecated?: boolean
    allowEmptyValue?: boolean

    style?: string
    explode?: boolean
    allowReserved?: boolean
    schema?: OpenAPISchema | OpenAPIReference
    example?: any
    examples?: { [name: string]: OpenAPIExample | OpenAPIReference }
}

export interface OpenAPIResponse {
    description: string
    headers?: { [name: string]: OpenAPIHeader | OpenAPIReference }
    content?: { [contentType: string]: OpenAPIMediaType }
    links?: { [name: string]: OpenAPILink | OpenAPIReference }
}

export interface OpenAPIExample {
    summary?: string
    description?: string
    value?: any
    externalValue?: string
}

export interface OpenAPIRequestBody {
    description?: string
    required?: boolean
    content: { [contentType: string]: OpenAPIMediaType }
}

export interface OpenAPIMediaType {
    schema?: OpenAPISchema | OpenAPIReference
    example?: any
    examples?: { [name: string]: OpenAPIExample | OpenAPIReference }
    encoding?: { [propertyName: string]: OpenAPIEncoding }
}

export interface OpenAPIEncoding {
    contentType?: string
    headers?: { [name: string]: OpenAPIHeader | OpenAPIReference }
    style?: string
    explode?: boolean
    allowReserved?: boolean
}

export interface OpenAPIHeader {
    description?: string
    required?: boolean
    deprecated?: boolean
    allowEmptyValue?: boolean

    style?: string
    explode?: boolean
    allowReserved?: boolean
    schema?: OpenAPISchema | OpenAPIReference
    example?: any
    examples?: { [name: string]: OpenAPIExample | OpenAPIReference }
}

export interface OpenAPISecurityRequirement {
    [name: string]: string[]
}

export interface OpenAPILink {
    operationRef?: string
    operationId?: string
    parameters?: { [name: string]: any }
    requestBody?: any
    description?: string
    server?: OpenAPIServer
}

export type OpenAPISecurityScheme = OpenAPISecuritySchemeAPIKey | OpenAPISecuritySchemeHTTP | OpenAPISecuritySchemeOauth2 | OpenAPISecuritySchemeOpenIdConnect

export interface OpenAPISecuritySchemeAPIKey {
    type: "apiKey"
    description?: string
    name: string
    in: "query" | "header" | "cookie"
}

export interface OpenAPISecuritySchemeHTTP {
    type: "http"
    description?: string
    scheme: string
    bearerFormat?: string
}

export interface OpenAPISecuritySchemeOpenIdConnect {
    type: "http"
    description?: string
    openIdConnectUrl: string
}

export interface OpenAPISecuritySchemeOauth2 {
    type: "oauth2"
    description?: string
    flows: {
        implicit?: OpenAPIOauthFlow
        password?: OpenAPIOauthFlow
        clientCredentials?: OpenAPIOauthFlow
        authorizationCode?: OpenAPIOauthFlow
    }
}

export interface OpenAPIOauthFlow {
    authorizationUrl: string
    tokenUrl: string
    refreshUrl?: string
    scopes: { [name: string]: string }
}

export interface OpenAPIExternalDocumentation {
    url: string
    description?: string
}

export interface OpenAPICallback {
    [name: string]: OpenIDPathItem
}