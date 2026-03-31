import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, type LoginSchema } from '@/features/auth/schemas/auth.schemas'
import {
    clearAllAuthStorage,
    getLastRememberedUsername,
    getRememberedUsers,
} from '@/features/auth/services/auth.storage'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { generateTokenCode } from '@/features/auth/utils/token'
import { TokenCodeBox } from '@/features/auth/components/token-code-box'
import { RegisterUserDialog } from '@/features/auth/components/register-user-dialog'
import { RememberedUsers } from '@/features/auth/components/remembered-users'

export function LoginPage() {
    const navigate = useNavigate()

    const { login, isAuthenticated } = useAuthStore()

    const [tokenCode, setTokenCode] = useState('')
    const [usersVersion, setUsersVersion] = useState(0)
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const rememberedUsers = useMemo(() => {
        return getRememberedUsers()
    }, [usersVersion])

    const {
        register,
        handleSubmit,
        setValue,
        resetField,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
            tokenCode: '',
        },
    })

    useEffect(() => {
        setTokenCode(generateTokenCode())

        const lastUsername = getLastRememberedUsername()

        if (lastUsername) {
            setValue('username', lastUsername)
        }
    }, [setValue])

    const currentUser = useAuthStore((state) => state.user)

    useEffect(() => {
        if (!isAuthenticated) {
            return
        }

        if (currentUser && !currentUser.hasPixSecurityConfigured) {
            navigate('/setup-pix-security')
            return
        }

        navigate('/dashboard')
    }, [currentUser, isAuthenticated, navigate])

    function refreshToken() {
        setTokenCode(generateTokenCode())
        resetField('tokenCode')
    }

    function handleSelectRememberedUser(username: string) {
        setValue('username', username)
    }

    function handleUserCreated(username: string) {
        setValue('username', username)
        setUsersVersion((current) => current + 1)
    }

    async function onSubmit(data: LoginSchema) {
        try {
            setIsSubmitting(true)
            setFeedbackMessage('')

            const result = await login({
                username: data.username,
                password: data.password,
                typedToken: data.tokenCode,
                displayedToken: tokenCode,
            })

            if (!result.success) {
                setFeedbackMessage(result.message)
                refreshToken()
                return
            }

            const loggedUser = useAuthStore.getState().user

            if (loggedUser && !loggedUser.hasPixSecurityConfigured) {
                navigate('/setup-pix-security')
                return
            }

            navigate('/dashboard')
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleClearAllData() {
        clearAllAuthStorage()
        setUsersVersion((current) => current + 1)
        setFeedbackMessage('')
        setValue('username', '')
        resetField('password')
        resetField('tokenCode')
        refreshToken()
        useAuthStore.getState().clearSession()
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-3xl border p-6 shadow-sm">
                    <div className="mb-6 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                            Onda Finance
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Entrar na aplicação
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Faça login com seu username, senha e o código exibido na tela.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register('username')}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                placeholder="Digite seu username"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                placeholder="Digite sua senha"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <TokenCodeBox code={tokenCode} onRefresh={refreshToken} />

                        <div className="space-y-2">
                            <label htmlFor="tokenCode" className="text-sm font-medium">
                                Código do token
                            </label>
                            <input
                                id="tokenCode"
                                type="text"
                                {...register('tokenCode')}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm uppercase outline-none transition focus:ring-2"
                                placeholder="Digite o código exibido"
                            />
                            {errors.tokenCode && (
                                <p className="text-sm text-red-500">{errors.tokenCode.message}</p>
                            )}
                        </div>

                        {feedbackMessage && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                                {feedbackMessage}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </button>

                            <button
                                type="button"
                                onClick={handleClearAllData}
                                className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                            >
                                Debug: apagar registros
                            </button>
                        </div>
                    </form>
                    <div className="mt-4">
                        <RegisterUserDialog onUserCreated={handleUserCreated} />
                    </div>
                </section>

                <aside className="space-y-6">
                    <RememberedUsers
                        users={rememberedUsers}
                        onSelectUser={handleSelectRememberedUser}
                    />

                    <div className="rounded-2xl border p-4">
                        <p className="text-sm font-medium">Fluxo simulado</p>
                        <ul className="text-muted-foreground mt-2 space-y-2 text-sm">
                            <li>• Cadastro local com dados fictícios</li>
                            <li>• Usuários lembrados neste computador</li>
                            <li>• Validação de senha</li>
                            <li>• Código visual para simular token</li>
                            <li>• Persistência de sessão</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </main>
    )
}