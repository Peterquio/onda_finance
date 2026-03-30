import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { registerUserSchema, type RegisterUserSchema } from '../schemas/auth.schemas'
import { registerLocalUser } from '../services/auth.storage'

type RegisterUserDialogProps = {
    onUserCreated?: (username: string) => void
}

export function RegisterUserDialog({
    onUserCreated,
}: RegisterUserDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterUserSchema>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            fullName: '',
            cpf: '',
            birthDate: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(data: RegisterUserSchema) {
        try {
            setIsSubmitting(true)
            setFeedbackMessage('')
            setFeedbackType('')

            const result = await registerLocalUser(data)

            if (!result.success) {
                setFeedbackMessage(result.message)
                setFeedbackType('error')
                return
            }

            setFeedbackMessage(result.message)
            setFeedbackType('success')

            if (result.user) {
                onUserCreated?.(result.user.username)
            }

            reset()

            setTimeout(() => {
                setOpen(false)
                setFeedbackMessage('')
                setFeedbackType('')
            }, 1200)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
                Cadastrar usuário
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl border bg-background p-6 shadow-xl">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Cadastro de usuário</h2>
                                <p className="text-muted-foreground text-sm">
                                    Preencha os dados fictícios para registrar um usuário neste dispositivo.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false)
                                    setFeedbackMessage('')
                                    setFeedbackType('')
                                }}
                                className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-accent"
                            >
                                Fechar
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-medium">
                                        Nome completo
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        {...register('fullName')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="Ex.: Maria da Silva"
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-500">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="cpf" className="text-sm font-medium">
                                        CPF fictício
                                    </label>
                                    <input
                                        id="cpf"
                                        type="text"
                                        {...register('cpf')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="000.000.000-00"
                                    />
                                    {errors.cpf && (
                                        <p className="text-sm text-red-500">{errors.cpf.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="birthDate" className="text-sm font-medium">
                                        Data de nascimento
                                    </label>
                                    <input
                                        id="birthDate"
                                        type="date"
                                        {...register('birthDate')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                    />
                                    {errors.birthDate && (
                                        <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        E-mail
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="email@exemplo.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telefone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        {...register('phone')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="(11) 99999-9999"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-medium">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        {...register('username')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="maria.silva"
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
                                        placeholder="Digite a senha"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirmar senha
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        {...register('confirmPassword')}
                                        className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                                        placeholder="Digite novamente a senha"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {feedbackMessage && (
                                <div
                                    className={`rounded-xl border px-4 py-3 text-sm ${feedbackType === 'success'
                                            ? 'border-green-500/30 bg-green-500/10 text-green-700'
                                            : 'border-red-500/30 bg-red-500/10 text-red-700'
                                        }`}
                                >
                                    {feedbackMessage}
                                </div>
                            )}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false)
                                        setFeedbackMessage('')
                                        setFeedbackType('')
                                    }}
                                    className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Salvando...' : 'Salvar cadastro'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}