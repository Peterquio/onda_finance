import type { LocalUser, RegisterUserInput } from '../types/auth.types'
import { hashPassword } from './auth.crypto'

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
        createdAt: new Date().toISOString(),
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