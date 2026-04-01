import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useDashboardStore } from "../../dashboard/store/dashboard.store"
import type {
    PixContact,
    PixTransferLog,
    PixTransferLogStep,
    PixTransferReceipt,
} from "../types/pix.types"
import { generateTransactionId } from "../utils/transaction-id"

type PixDraft = {
    recipientName: string
    pixKey: string
    bankName: string
    amount: number
    password: string
    token: string
}

type PixStore = {
    simulatedToken: string

    recentContacts: PixContact[]
    logs: PixTransferLog[]
    transferHistory: PixTransferReceipt[]
    lastReceipt: PixTransferReceipt | null

    draft: PixDraft

    setRecipientName: (name: string) => void
    setPixKey: (pixKey: string) => void
    setBankName: (bankName: string) => void
    setAmount: (amount: number) => void
    setPassword: (password: string) => void
    setToken: (token: string) => void

    addRecentContact: (contact: PixContact) => void
    addLog: (step: PixTransferLogStep, details?: Record<string, string | number>) => void

    confirmTransfer: () => void
    resetDraft: () => void
}

const initialDraft: PixDraft = {
    recipientName: "",
    pixKey: "",
    bankName: "",
    amount: 0,
    password: "",
    token: "",
}

export const usePixStore = create<PixStore>()(
    persist(
        (set, get) => ({
            simulatedToken: "000000",

            recentContacts: [
                {
                    id: "1",
                    name: "Ana Lima",
                    pixKey: "ana@email.com",
                    bankName: "Banco Inter",
                },
                {
                    id: "2",
                    name: "Carlos Souza",
                    pixKey: "11999999999",
                    bankName: "Nubank",
                },
                {
                    id: "3",
                    name: "Marina Alves",
                    pixKey: "123.456.789-00",
                    bankName: "Itaú",
                },
                {
                    id: "4",
                    name: "Pedro Rocha",
                    pixKey: "empresa@pix.com",
                    bankName: "Bradesco",
                },
            ],

            logs: [],
            transferHistory: [],
            lastReceipt: null,

            draft: initialDraft,

            setRecipientName: (name) =>
                set((state) => ({
                    draft: { ...state.draft, recipientName: name },
                })),

            setPixKey: (pixKey) =>
                set((state) => ({
                    draft: { ...state.draft, pixKey },
                })),

            setBankName: (bankName) =>
                set((state) => ({
                    draft: { ...state.draft, bankName },
                })),

            setAmount: (amount) =>
                set((state) => ({
                    draft: { ...state.draft, amount },
                })),

            setPassword: (password) =>
                set((state) => ({
                    draft: { ...state.draft, password },
                })),

            setToken: (token) =>
                set((state) => ({
                    draft: { ...state.draft, token },
                })),

            addRecentContact: (contact) =>
                set((state) => {
                    const filtered = state.recentContacts.filter(
                        (item) => item.pixKey !== contact.pixKey,
                    )

                    return {
                        recentContacts: [contact, ...filtered].slice(0, 4),
                    }
                }),

            addLog: (step, details) =>
                set((state) => ({
                    logs: [
                        ...state.logs,
                        {
                            id: crypto.randomUUID(),
                            step,
                            timestamp: new Date().toISOString(),
                            details,
                        },
                    ],
                })),

            confirmTransfer: () => {
                const { draft, addRecentContact, addLog } = get()

                const receipt: PixTransferReceipt = {
                    transactionId: generateTransactionId(),
                    recipientName: draft.recipientName,
                    recipientPixKey: draft.pixKey,
                    recipientBankName: draft.bankName || "Onda Finance",
                    senderInstitution: "Onda Finance",
                    amount: draft.amount,
                    receivedAmount: draft.amount,
                    createdAt: new Date().toISOString(),
                }

                addRecentContact({
                    id: crypto.randomUUID(),
                    name: draft.recipientName,
                    pixKey: draft.pixKey,
                    bankName: draft.bankName || "Onda Finance",
                })

                addLog("PIX_TRANSFER_CONFIRMED", {
                    recipientName: draft.recipientName,
                    pixKey: draft.pixKey,
                    amount: draft.amount,
                    transactionId: receipt.transactionId,
                })

                useDashboardStore.getState().addTransaction({
                    id: crypto.randomUUID(),
                    title: `PIX enviado para ${draft.recipientName}`,
                    amount: draft.amount,
                    type: "expense",
                    date: new Date().toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                })

                set((state) => ({
                    transferHistory: [receipt, ...state.transferHistory],
                    lastReceipt: receipt,
                    draft: initialDraft,
                }))
            },

            resetDraft: () =>
                set({
                    draft: initialDraft,
                }),
        }),
        {
            name: "onda-finance:pix",
            partialize: (state) => ({
                simulatedToken: state.simulatedToken,
                recentContacts: state.recentContacts,
                logs: state.logs,
                transferHistory: state.transferHistory,
                lastReceipt: state.lastReceipt,
            }),
        },
    ),
)