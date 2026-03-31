const PBKDF2_ITERATIONS = 210_000
const KEY_LENGTH = 32

function bytesToBase64(bytes: Uint8Array): string {
    let binary = ''

    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte)
    })

    return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
    }

    return bytes
}

function normalizeSecretAnswer(answer: string): string {
    return answer.trim().toLowerCase()
}

async function deriveHash(
    value: string,
    salt: Uint8Array,
    iterations: number,
): Promise<Uint8Array> {
    const encoder = new TextEncoder()

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(value),
        { name: 'PBKDF2' },
        false,
        ['deriveBits'],
    )

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-256',
        },
        keyMaterial,
        KEY_LENGTH * 8,
    )

    return new Uint8Array(derivedBits)
}

function safeEqual(left: Uint8Array, right: Uint8Array): boolean {
    if (left.length !== right.length) {
        return false
    }

    let diff = 0

    for (let index = 0; index < left.length; index += 1) {
        diff |= left[index] ^ right[index]
    }

    return diff === 0
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const hash = await deriveHash(password, salt, PBKDF2_ITERATIONS)

    return [
        'pbkdf2',
        String(PBKDF2_ITERATIONS),
        bytesToBase64(salt),
        bytesToBase64(hash),
    ].join('$')
}

export async function comparePassword(
    password: string,
    passwordHash: string,
): Promise<boolean> {
    const [algorithm, iterationsText, saltBase64, hashBase64] = passwordHash.split('$')

    if (algorithm !== 'pbkdf2' || !iterationsText || !saltBase64 || !hashBase64) {
        return false
    }

    const iterations = Number(iterationsText)

    if (!Number.isFinite(iterations) || iterations <= 0) {
        return false
    }

    const salt = base64ToBytes(saltBase64)
    const expectedHash = base64ToBytes(hashBase64)
    const actualHash = await deriveHash(password, salt, iterations)

    return safeEqual(actualHash, expectedHash)
}

export async function hashSecretAnswer(answer: string): Promise<string> {
    return hashPassword(normalizeSecretAnswer(answer))
}

export async function compareSecretAnswer(
    answer: string,
    answerHash: string,
): Promise<boolean> {
    return comparePassword(normalizeSecretAnswer(answer), answerHash)
}