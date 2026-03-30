export type LocalUser = {
    id: string
    fullName: string
    cpf: string
    birthDate: string
    email: string
    phone: string
    username: string
    passwordHash: string
    createdAt: string
}

export type RegisterUserInput = {
    fullName: string
    cpf: string
    birthDate: string
    email: string
    phone: string
    username: string
    password: string
    confirmPassword: string
}

export type LoginInput = {
    username: string
    password: string
    tokenCode: string
}

export type AuthSession = {
    isAuthenticated: boolean
    user: LocalUser | null
    loggedAt: string | null
}