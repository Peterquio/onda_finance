const TOKEN_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const TOKEN_LENGTH = 5

export function generateTokenCode(length = TOKEN_LENGTH): string {
    let result = ''

    for (let index = 0; index < length; index += 1) {
        const randomIndex = Math.floor(Math.random() * TOKEN_CHARACTERS.length)
        result += TOKEN_CHARACTERS[randomIndex]
    }

    return result
}

export function normalizeTokenCode(value: string): string {
    return value.trim().toUpperCase()
}

export function validateTokenCode(
    typedCode: string,
    displayedCode: string,
): boolean {
    return normalizeTokenCode(typedCode) === normalizeTokenCode(displayedCode)
}