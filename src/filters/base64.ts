export function base64encode(value: string) {
    return btoa(value)
}

export function base64decode(value: string) {
    return atob(value)
}
