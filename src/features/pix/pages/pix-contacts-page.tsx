import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PixContactCard } from "../components/pix-contact-card"
import { usePixStore } from "../store/pix.store"

export default function PixContactsPage() {
    const navigate = useNavigate()
    const {
        recentContacts,
        setRecipientName,
        setPixKey,
        setBankName,
        addLog,
        resetDraft,
    } = usePixStore()

    const [recipientName, setRecipientNameInput] = useState("")
    const [pixKey, setPixKeyInput] = useState("")

    function handleContinue() {
        if (!recipientName.trim() || !pixKey.trim()) return

        setRecipientName(recipientName.trim())
        setPixKey(pixKey.trim())
        setBankName("Onda Finance")

        addLog("PIX_KEY_FILLED", {
            recipientName: recipientName.trim(),
            pixKey: pixKey.trim(),
        })

        navigate("/pix/amount")
    }

    function handleSelectRecent(name: string, key: string, bankName: string) {
        setRecipientName(name)
        setPixKey(key)
        setBankName(bankName)

        addLog("PIX_CONTACT_SELECTED", {
            recipientName: name,
            pixKey: key,
            bankName,
        })

        navigate("/pix/amount")
    }

    function handleCancel() {
        resetDraft()
        navigate("/dashboard")
    }

    useEffect(() => {
        resetDraft()
        addLog("PIX_OPENED")
    }, [resetDraft, addLog])

    return (
        <div className="mx-auto max-w-xl space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-bold">Transferência via PIX</h1>
                <p className="text-sm text-muted-foreground">
                    Digite a chave PIX ou selecione um contato recente.
                </p>
            </div>

            <div className="space-y-4 rounded-2xl border p-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Digite o nome da pessoa fictícia a receber
                    </label>
                    <input
                        value={recipientName}
                        onChange={(e) => setRecipientNameInput(e.target.value)}
                        className="w-full rounded-2xl border px-4 py-3"
                        placeholder="Ex.: Maria Oliveira"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Chave PIX</label>
                    <input
                        value={pixKey}
                        onChange={(e) => setPixKeyInput(e.target.value)}
                        className="w-full rounded-2xl border px-4 py-3"
                        placeholder="CPF, e-mail, telefone ou chave aleatória"
                    />
                </div>

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
                        onClick={handleContinue}
                        className="w-full rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
                    >
                        Continuar
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="font-semibold">Últimos 4 contatos</h2>

                {recentContacts.map((contact) => (
                    <PixContactCard
                        key={contact.id}
                        contact={contact}
                        onSelect={(selected) =>
                            handleSelectRecent(selected.name, selected.pixKey, selected.bankName)
                        }
                    />
                ))}
            </div>
        </div>
    )
}