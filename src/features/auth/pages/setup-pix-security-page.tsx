import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/auth.store'
import { configurePixSecurityForUser } from '../services/auth.storage'

export default function SetupPixSecurityPage() {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser)

    const [pixPin, setPixPin] = useState('')
    const [confirmPixPin, setConfirmPixPin] = useState('')
    const [secretQuestion, setSecretQuestion] = useState('Qual é o nome do seu primeiro pet?')
    const [secretAnswer, setSecretAnswer] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!currentUser) {
            setFeedbackMessage('Sessão inválida.')
            return
        }

        if (!/^\d{4}$/.test(pixPin)) {
            setFeedbackMessage('A senha PIX deve conter exatamente 4 dígitos.')
            return
        }

        if (pixPin !== confirmPixPin) {
            setFeedbackMessage('A confirmação da senha PIX não confere.')
            return
        }

        if (!secretQuestion.trim() || !secretAnswer.trim()) {
            setFeedbackMessage('Preencha a pergunta secreta e a resposta.')
            return
        }

        try {
            setIsSubmitting(true)
            setFeedbackMessage('')

            const result = await configurePixSecurityForUser({
                userId: currentUser.id,
                pixPin,
                secretQuestion,
                secretAnswer,
            })

            if (!result.success) {
                setFeedbackMessage(result.message)
                return
            }

            refreshCurrentUser()
            navigate('/dashboard')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-3xl border p-6 shadow-sm">
                <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Primeiro acesso
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Configure sua segurança PIX
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Antes de continuar, cadastre sua senha de 4 dígitos e uma pergunta secreta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha PIX (4 dígitos)</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={pixPin}
                            onChange={(event) =>
                                setPixPin(event.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                            placeholder="••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar senha PIX</label>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={confirmPixPin}
                            onChange={(event) =>
                                setConfirmPixPin(event.target.value.replace(/\D/g, '').slice(0, 4))
                            }
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
                            placeholder="••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pergunta secreta</label>
                        <input
                            type="text"
                            value={secretQuestion}
                            onChange={(event) => setSecretQuestion(event.target.value)}
                            className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2"
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

                    {feedbackMessage && (
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                            {feedbackMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'Salvando...' : 'Concluir configuração'}
                    </button>
                </form>
            </div>
        </main>
    )
}