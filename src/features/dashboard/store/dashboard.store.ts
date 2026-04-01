import { create } from "zustand"
import { persist } from "zustand/middleware"
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

function calculateBalanceFromTransactions(transactions: Transaction[]) {
    return transactions.reduce((total, transaction) => {
        if (transaction.type === "income") {
            return total + transaction.amount
        }

        return total - transaction.amount
    }, 0)
}

const initialBalance = calculateBalanceFromTransactions(initialTransactions)
export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            balance: initialBalance,
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
        }),
        {
            name: "onda-finance:dashboard",
            partialize: (state) => ({
                balance: state.balance,
                limit: state.limit,
                transactions: state.transactions,
            }),
        },
    ),
)