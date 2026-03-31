import type { LocalUser, RegisterUserInput } from '../types/auth.types'
import {
    compareSecretAnswer,
    hashPassword,
    hashSecretAnswer,
} from './auth.crypto'

const USERS_STORAGE_KEY = 'onda-finance:users'
const LAST_USERNAME_STORAGE_KEY = 'onda-finance:last-username'
function normalizeUsername(username: string): string {
    return username.trim().toLowerCase()
}
function safeJsonParse<T>(value: string | null, fallback: T): T {
    if (!value) {
        return fallback
    }

    try {
        return JSON.parse(value) as T
    } catch {
        return fallback
    }
}

function generateUserId(): string {
    return crypto.randomUUID()
}

export function getStoredUsers(): LocalUser[] {
    const rawData = localStorage.getItem(USERS_STORAGE_KEY)
    return safeJsonParse<LocalUser[]>(rawData, [])
}

function saveStoredUsers(users: LocalUser[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function getUserByUsername(username: string): LocalUser | undefined {
    const normalizedUsername = normalizeUsername(username)

    return getStoredUsers().find(
        (user) => normalizeUsername(user.username) === normalizedUsername,
    )
}

export function getRememberedUsers(): LocalUser[] {
    return getStoredUsers().sort((currentUser, nextUser) =>
        currentUser.fullName.localeCompare(nextUser.fullName, 'pt-BR'),
    )
}

export async function registerLocalUser(
    userData: RegisterUserInput,
): Promise<{ success: boolean; message: string; user?: LocalUser }> {
    const existingUser = getUserByUsername(userData.username)

    if (existingUser) {
        return {
            success: false,
            message: 'Esse username já está cadastrado neste dispositivo.',
        }
    }

    const passwordHash = await hashPassword(userData.password)

    const newUser: LocalUser = {
        id: generateUserId(),
        fullName: userData.fullName.trim(),
        cpf: userData.cpf.trim(),
        birthDate: userData.birthDate,
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.trim(),
        username: normalizeUsername(userData.username),
        passwordHash,
        pixPinHash: null,
        secretQuestion: null,
        secretAnswerHash: null,
        hasPixSecurityConfigured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    const users = getStoredUsers()
    users.push(newUser)
    saveStoredUsers(users)

    return {
        success: true,
        message: 'Usuário cadastrado com sucesso.',
        user: newUser,
    }
}

export function clearAllLocalUsers(): void {
    localStorage.removeItem(USERS_STORAGE_KEY)
    localStorage.removeItem(LAST_USERNAME_STORAGE_KEY)
}

export function rememberLastUsername(username: string): void {
    localStorage.setItem(LAST_USERNAME_STORAGE_KEY, username.trim())
}

export function getLastRememberedUsername(): string {
    return localStorage.getItem(LAST_USERNAME_STORAGE_KEY) ?? ''
}

export function clearAllAuthStorage(): void {
    localStorage.removeItem('onda-finance:users')
    localStorage.removeItem('onda-finance:last-username')
    localStorage.removeItem('onda-finance:auth-session')
}

export function getUserById(userId: string): LocalUser | undefined {
    return getStoredUsers().find((user) => user.id === userId)
}

function updateStoredUser(updatedUser: LocalUser): void {
    const users = getStoredUsers().map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
    )

    saveStoredUsers(users)
}

export async function configurePixSecurityForUser(params: {
    userId: string
    pixPin: string
    secretQuestion: string
    secretAnswer: string
}): Promise<{ success: boolean; message: string; user?: LocalUser }> {
    const user = getUserById(params.userId)

    if (!user) {
        return {
            success: false,
            message: 'Usuário não encontrado.',
        }
    }

    const pixPinHash = await hashPassword(params.pixPin)
    const secretAnswerHash = await hashSecretAnswer(params.secretAnswer)

    const updatedUser: LocalUser = {
        ...user,
        pixPinHash,
        secretQuestion: params.secretQuestion.trim(),
        secretAnswerHash,
        hasPixSecurityConfigured: true,
        updatedAt: new Date().toISOString(),
    }

    updateStoredUser(updatedUser)

    return {
        success: true,
        message: 'Senha PIX configurada com sucesso.',
        user: updatedUser,
    }
}

export async function changePixPasswordForUser(params: {
    userId: string
    secretAnswer: string
    newPixPin: string
}): Promise<{ success: boolean; message: string; user?: LocalUser }> {
    const user = getUserById(params.userId)

    if (!user) {
        return {
            success: false,
            message: 'Usuário não encontrado.',
        }
    }

    if (!user.secretQuestion || !user.secretAnswerHash) {
        return {
            success: false,
            message: 'Este usuário ainda não configurou a segurança PIX.',
        }
    }

    const isAnswerValid = await compareSecretAnswer(
        params.secretAnswer,
        user.secretAnswerHash,
    )

    if (!isAnswerValid) {
        return {
            success: false,
            message: 'Resposta da pergunta secreta incorreta.',
        }
    }

    const newPixPinHash = await hashPassword(params.newPixPin)

    const updatedUser: LocalUser = {
        ...user,
        pixPinHash: newPixPinHash,
        updatedAt: new Date().toISOString(),
    }

    updateStoredUser(updatedUser)

    return {
        success: true,
        message: 'Senha PIX alterada com sucesso.',
        user: updatedUser,
    }
}