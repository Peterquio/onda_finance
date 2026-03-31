import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/auth.store'
import { changePixPasswordForUser } from '../services/auth.storage'

export default function ChangePixPasswordPage() {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser)

    const [secretAnswer, setSecretAnswer] = useState('')
    const [newPixPin, setNewPixPin] = useState('')
    const [confirmNewPixPin, setConfirmNewPixPin] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | ''>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!currentUser) {
            setFeedbackMessage('Sessão inválida.')
            setFeedbackType('error')
            return
        }

        if (!/^\d{4}$/.test(newPixPin)) {
            setFeedbackMessage('A nova senha PIX deve conter exatamente 4 dígitos.')
            setFeedbackType('error')
            return
        }

        if (newPixPin !== confirmNewPixPin) {
            setFeedbackMessage('A confirmação da nova senha não confere.')
            setFeedbackType('error')
            return
        }

        try {
            setIsSubmitting(true)
            setFeedbackMessage('')
            setFeedbackType('')

            const result = await changePixPasswordForUser({
                userId: currentUser.id,
                secretAnswer,
                newPixPin,
            })

            if (!result.success) {
                setFeedbackMessage(result.message)
                setFeedbackType('error')
                return
            }

            refreshCurrentUser()
            setFeedbackMessage(result.message)
            setFeedbackType('success')

            setTimeout(() => {
                navigate('/dashboard')
            }, 900)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-3xl border p-6 shadow-sm">
                <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Segurança PIX
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Trocar senha PIX
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Para alterar a senha, responda sua pergunta secreta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pergunta secreta</label>
                        <input
                            type="text"
                            value={currentUser?.secretQuestion ?? ''}
                            disabled
                            className="w-full rounded-xl border bg-muted px-3 py-2 text-sm outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resposta secreta</label>
                        <input
                            type="password"
                            value={secretAnswer}
                            onChange={(event) => setSecretAnswer(event.target.value)}
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                            placeholder="Digite sua resposta"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nova senha PIX</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={newPixPin}
                            onChange={(event) =>
                                setNewPixPin(event.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                            placeholder="••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar nova senha PIX</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={confirmNewPixPin}
                            onChange={(event) =>
                                setConfirmNewPixPin(
                                    event.target.value.replace(/\D/g, '').slice(0, 4),
                                )
                            }
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                            placeholder="••••"
                        />
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

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}