import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PixPasswordInput } from "../components/pix-password-input"
import { usePixStore } from "../store/pix.store"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { comparePassword } from "@/features/auth/services/auth.crypto"
export default function PixAuthPage() {
    const navigate = useNavigate()

    const {
        draft,
        simulatedToken,
        setPassword,
        setToken,
        confirmTransfer,
        addLog,
        resetDraft,
    } = usePixStore()

    const currentUser = useAuthStore((state) => state.user)
    const [feedbackMessage, setFeedbackMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit() {
        if (!currentUser) {
            setFeedbackMessage("Sessão inválida. Faça login novamente.")
            return
        }

        if (!currentUser.hasPixSecurityConfigured || !currentUser.pixPinHash) {
            setFeedbackMessage("Você ainda não configurou sua senha PIX.")
            return
        }

        if (draft.password.length !== 4) {
            setFeedbackMessage("A senha PIX deve ter 4 dígitos.")
            return
        }

        if (draft.token !== simulatedToken) {
            setFeedbackMessage("Token inválido.")
            return
        }

        try {
            setIsSubmitting(true)
            setFeedbackMessage("")

            const isPixPasswordValid = await comparePassword(
                draft.password,
                currentUser.pixPinHash,
            )

            if (!isPixPasswordValid) {
                setFeedbackMessage("Senha PIX inválida.")
                return
            }

            addLog("PIX_PASSWORD_FILLED", {
                passwordLength: draft.password.length,
            })

            addLog("PIX_TOKEN_FILLED", {
                tokenLength: draft.token.length,
            })

            confirmTransfer()
            navigate("/pix/receipt")
        } finally {
            setIsSubmitting(false)
        }
    }
    function handleCancel() {
        resetDraft()
        navigate("/dashboard")
    }

    return (
        <div className="mx-auto max-w-xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Autenticação da transferência</h1>
                <p className="text-sm text-muted-foreground">
                    Informe sua senha de 4 dígitos e o token simulado.
                </p>
            </div>
            <div className="space-y-4 rounded-2xl border p-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Senha PIX</label>
                    <PixPasswordInput
                        value={draft.password}
                        onChange={(value) => setPassword(value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Token simulado</label>
                    <input
                        value={draft.token}
                        onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        className="w-full rounded-2xl border px-4 py-3 text-center tracking-[0.3em]"
                        placeholder="000000"
                    />
                    <p className="text-xs text-muted-foreground">
                        Token de teste atual: {simulatedToken}
                    </p>
                </div>
                {feedbackMessage && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {feedbackMessage}
                    </div>
                )}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="w-full rounded-2xl border px-4 py-3 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-primary px-4 py-3 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Validando..." : "Enviar PIX"}
                    </button>
                </div>
            </div>
        </div>
    )
}