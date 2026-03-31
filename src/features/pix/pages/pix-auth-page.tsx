import { useNavigate } from "react-router-dom"
import { PixPasswordInput } from "../components/pix-password-input"
import { usePixStore } from "../store/pix.store"

export default function PixAuthPage() {
    const navigate = useNavigate()

    const {
        draft,
        pixPassword,
        simulatedToken,
        setPassword,
        setToken,
        confirmTransfer,
        addLog,
    } = usePixStore()

    function handleSubmit() {
        if (draft.password.length !== 4) {
            alert("A senha PIX deve ter 4 dígitos.")
            return
        }

        if (draft.token !== simulatedToken) {
            alert("Token inválido.")
            return
        }

        if (draft.password !== pixPassword) {
            alert("Senha PIX inválida.")
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

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
                >
                    Enviar PIX
                </button>
            </div>
        </div>
    )
}