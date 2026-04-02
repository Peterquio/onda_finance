import { useNavigate } from "react-router-dom"
import { usePixStore } from "../store/pix.store"
import { formatCurrencyBRL } from "../utils/currency"
import { useAuthStore } from "@/features/auth/store/auth.store"

export default function PixReceiptPage() {
    const navigate = useNavigate()
    const { lastReceipt, addLog } = usePixStore()
    const currentUser = useAuthStore((state) => state.user)

    if (!lastReceipt) {
        return (
            <div className="mx-auto max-w-xl p-6">
                <p>Nenhuma transferência encontrada.</p>
            </div>
        )
    }

    const date = new Date(lastReceipt.createdAt)

    function handleFinish() {
        addLog("PIX_FINISHED", {
            transactionId: lastReceipt.transactionId,
        })

        navigate("/dashboard")
    }

    return (
        <div className="mx-auto max-w-xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Comprovante PIX</h1>
                <p className="text-sm text-muted-foreground">
                    Transferência realizada com sucesso.
                </p>
            </div>

            <div className="space-y-4 rounded-2xl border p-6">
                <div>
                    <p className="text-sm text-muted-foreground">ID da transação</p>
                    <p className="font-medium">{lastReceipt.transactionId}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Remetente</p>
                    <p className="font-medium">{currentUser?.fullName ?? "Cliente"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Destinatário</p>
                    <p className="font-medium">{lastReceipt.recipientName}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Instituição bancária</p>
                    <p className="font-medium">{lastReceipt.recipientBankName}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Instituição financeira remetente</p>
                    <p className="font-medium">{lastReceipt.senderInstitution}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">{formatCurrencyBRL(lastReceipt.amount)}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Valor recebido</p>
                    <p className="font-medium">{formatCurrencyBRL(lastReceipt.receivedAmount)}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{date.toLocaleDateString("pt-BR")}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">{date.toLocaleTimeString("pt-BR")}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Chave PIX</p>
                    <p className="font-medium">{lastReceipt.recipientPixKey}</p>
                </div>
            </div>

            <button
                type="button"
                onClick={handleFinish}
                className="w-full rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
            >
                Voltar ao Início
            </button>
        </div>
    )
}