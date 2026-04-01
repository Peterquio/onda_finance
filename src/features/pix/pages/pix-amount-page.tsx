import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PixKeypad } from "../components/pix-keypad"
import { usePixStore } from "../store/pix.store"
import { digitsToMoney, formatCurrencyBRL, moneyToDigits } from "../utils/currency"
import { useDashboardStore } from "@/features/dashboard/store/dashboard.store"

export default function PixAmountPage() {
    const navigate = useNavigate()
    const { draft, setAmount, addLog, resetDraft } = usePixStore()
    const balance = useDashboardStore((state) => state.balance)
    const limit = useDashboardStore((state) => state.limit)

    const [digits, setDigits] = useState(moneyToDigits(draft.amount))
    const [feedbackMessage, setFeedbackMessage] = useState("")

    const amount = useMemo(() => digitsToMoney(digits), [digits])
    const availableAmount = useMemo(() => balance + limit, [balance, limit])

    function appendDigit(value: string) {
        setDigits((prev) => `${prev}${value}`.replace(/^0+(?=\d)/, ""))
    }

    function removeDigit() {
        setDigits((prev) => prev.slice(0, -1))
    }

    function handleInputChange(value: string) {
        const onlyDigits = value.replace(/\D/g, "")
        setDigits(onlyDigits)
    }

    function handleConfirm() {
        if (amount <= 0) {
            setFeedbackMessage("Digite um valor maior que zero.")
            return
        }

        if (amount > availableAmount) {
            setFeedbackMessage("Saldo + limite insuficientes para esta transferência.")
            return
        }

        setFeedbackMessage("")
        setAmount(amount)

        addLog("PIX_AMOUNT_CONFIRMED", {
            recipientName: draft.recipientName,
            amount,
        })

        navigate("/pix/auth")
    }

    function handleCancel() {
        resetDraft()
        navigate("/dashboard")
    }

    return (
        <div className="mx-auto max-w-xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Qual valor deseja transferir?</h1>
                <p className="text-sm text-muted-foreground">
                    Enviando para {draft.recipientName || "destinatário"}.
                </p>
            </div>

            <div className="rounded-2xl border p-6 text-center">
                <p className="mb-2 text-xs text-muted-foreground">
                    Disponível para transferir: {formatCurrencyBRL(availableAmount)}
                </p>

                <div className="mb-4 text-4xl font-bold">{formatCurrencyBRL(amount)}</div>

                <input
                    value={digits}
                    onChange={(e) => handleInputChange(e.target.value)}
                    inputMode="numeric"
                    className="w-full rounded-2xl border px-4 py-3 text-center"
                    placeholder="Digite números"
                />
                {feedbackMessage && (
                    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                        {feedbackMessage}
                    </div>
                )}
            </div>

            <PixKeypad onKeyPress={appendDigit} onBackspace={removeDigit} />

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full rounded-2xl border px-4 py-3"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
                >
                    Confirmar valor
                </button>
            </div>
        </div>
    )
}