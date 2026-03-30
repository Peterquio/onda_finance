import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession } from '../types/auth.types'
import { comparePassword } from '../services/auth.crypto'
import {
    getUserByUsername,
    rememberLastUsername,
} from '../services/auth.storage'
import { validateTokenCode } from '../utils/token'

type LoginParams = {
    username: string
    password: string
    typedToken: string
    displayedToken: string
}

type LoginResult = {
    success: boolean
    message: string
}

type AuthStore = AuthSession & {
    login: (params: LoginParams) => Promise<LoginResult>
    logout: () => void
    clearSession: () => void
}

const initialState: AuthSession = {
    isAuthenticated: false,
    user: null,
    loggedAt: null,
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,

            login: async ({
                username,
                password,
                typedToken,
                displayedToken,
            }: LoginParams): Promise<LoginResult> => {
                const normalizedUsername = username.trim()

                const user = getUserByUsername(normalizedUsername)

                if (!user) {
                    return {
                        success: false,
                        message: 'Usuário não encontrado neste dispositivo.',
                    }
                }

                const isPasswordValid = await comparePassword(
                    password,
                    user.passwordHash,
                )

                if (!isPasswordValid) {
                    return {
                        success: false,
                        message: 'Senha incorreta.',
                    }
                }

                const isTokenValid = validateTokenCode(typedToken, displayedToken)

                if (!isTokenValid) {
                    return {
                        success: false,
                        message: 'O código informado não confere com o exibido na tela.',
                    }
                }

                rememberLastUsername(user.username)

                set({
                    isAuthenticated: true,
                    user,
                    loggedAt: new Date().toISOString(),
                })

                return {
                    success: true,
                    message: 'Login realizado com sucesso.',
                }
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    loggedAt: null,
                })
            },

            clearSession: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    loggedAt: null,
                })
            },
        }),
        {
            name: 'onda-finance:auth-session',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                loggedAt: state.loggedAt,
            }),
        },
    ),
)