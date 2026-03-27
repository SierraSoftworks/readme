import type { OpenAPISchema } from "@/formats/openapi"

export function generateExampleXML(schema: OpenAPISchema, mode: "read" | "write"): string {
    const docType = `<?xml version="1.0" encoding="UTF-8"?>`

    const generator = new XMLExampleGenerator(mode)
    try {
        generator.visit(schema)
    } catch (err: any) {
        return `${docType}\n<-- ${err.message} -->`
    }

    return `${docType}\n${generator.result}`
}

class XMLExampleGenerator {
    constructor(private mode: "read" | "write") {}

    private propertyStack: string[] = []
    private elementStack: Element[] = [
        document.createElement("root")
    ]
    private indented: boolean = true

    get result(): string {
        return this.elementStack[0].innerHTML.trim()
    }

    visit(schema: OpenAPISchema) {
        if (schema.readOnly && this.mode !== "read") return
        if (schema.writeOnly && this.mode !== "write") return

        switch (schema.type || "object") {
            case "object":
                return this.visitObject(schema)
            case "array":
                return this.visitArray(schema)
            case "boolean":
                return this.visitBoolean(schema)
            case "integer":
            case "number":
                return this.visitNumber(schema)
            case "string":
                return this.visitString(schema)
            default:
                throw new Error(`Unrecognized schema element type ${schema.type}`)
        }
    }

    private visitProperty(name: string, schema: OpenAPISchema) {
        this.propertyStack.push(name)
        this.visit(schema)
        this.propertyStack.pop()
    }

    private visitObject(schema: OpenAPISchema) {
        const xml = schema.xml || {}
        const name = xml.name || this.currentProperty

        if (xml.attribute) throw new Error("Cannot represent an object within an attribute")

        this.elementStack.push(this.addElement(name))

        Object.keys(schema.properties || {}).forEach(k => {
            this.visitProperty(k, schema.properties![k] as OpenAPISchema)
        })

        this.endElement()
    }

    private visitArray(schema: OpenAPISchema) {
        const xml = schema.xml || {}
        if (xml.attribute) throw new Error("Cannot represent an object within an attribute")

        if (xml.wrapped) {
            const name = xml.name || this.currentProperty

            this.elementStack.push(this.addElement(name))
        }

        this.visit(schema.items as OpenAPISchema)

        if (xml.wrapped) this.endElement()
    }

    private visitNumber(schema: OpenAPISchema) {
        return this.visitValue(schema, v => v)
    }

    private visitBoolean(schema: OpenAPISchema) {
        return this.visitValue(schema, v => v ? "true" : "false")
    }

    private visitString(schema: OpenAPISchema) {
        return this.visitValue(schema, v => v)
    }

    private visitValue(schema: OpenAPISchema, formatter: (example: any) => string) {
        if (!schema.example) return

        const xml = schema.xml || {}
        const name = xml.name || this.currentProperty

        if (xml.attribute) this.currentElement.setAttribute(name, formatter(schema.example))
        else {
            this.elementStack.push(this.addElement(name, formatter(schema.example)))
            this.endElement()
        }
    }

    private addElement(name: string, value?: string): Element {
        if (!this.indented) {
            this.currentElement.appendChild(document.createTextNode(`\n${this.indentation}`))
        } else {
            this.currentElement.appendChild(document.createTextNode(`  `))
        }

        const el = document.createElement(name)
        if (value !== undefined)
            el.innerText = value

        this.currentElement.appendChild(el)
        this.indented = false
        return el
    }

    private endElement(): Element {
        const child = this.elementStack.pop()!

        this.currentElement.appendChild(document.createTextNode(`\n${this.indentation.substr(2)}`))
        this.indented = true
        return child
    }

    private get currentElement(): Element {
        if (!this.elementStack.length) throw new Error("XML example generator has entered an unexpected state: root element removed")
        return this.elementStack[this.elementStack.length - 1]
    }

    private get currentProperty(): string {
        if (!this.elementStack.length) throw new Error("XML example cannot be generated; root element name is undefined")
        return this.propertyStack[this.propertyStack.length - 1]
    }

    private get indentation(): string {
        return new Array(this.elementStack.length - 1).fill("  ").join("")
    }
}
