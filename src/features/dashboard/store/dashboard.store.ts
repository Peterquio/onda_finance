import { create } from "zustand"
import { initialTransactions } from "../mocks/transactions.mock"
import type { Transaction } from "../types/transaction"

interface DashboardState {
    balance: number
    limit: number
    transactions: Transaction[]
    addTransaction: (transaction: Transaction) => void
    receiveTransfer: (amount: number) => void
}

const randomPeople = [
    "João Silva",
    "Maria Souza",
    "Carlos Lima",
    "Fernanda Alves",
    "Pedro Henrique",
    "Juliana Costa",
]

function formatNow() {
    return new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const useDashboardStore = create<DashboardState>((set) => ({
    balance: 2480.35,
    limit: 1000,
    transactions: initialTransactions,

    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [transaction, ...state.transactions],
            balance:
                transaction.type === "income"
                    ? state.balance + transaction.amount
                    : state.balance - transaction.amount,
        })),

    receiveTransfer: (amount) =>
        set((state) => {
            const person =
                randomPeople[Math.floor(Math.random() * randomPeople.length)]

            const newTransaction: Transaction = {
                id: crypto.randomUUID(),
                title: `PIX recebido de ${person}`,
                amount,
                type: "income",
                date: formatNow(),
            }

            return {
                balance: state.balance + amount,
                transactions: [newTransaction, ...state.transactions],
            }
        }),
}))