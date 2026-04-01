import type { Transaction } from "../types/transaction"

export const initialTransactions: Transaction[] = [
    {
        id: "1",
        title: "Supermercado Pague Menos",
        amount: 152.75,
        type: "expense",
        date: "01/04/2026 08:30",
    },
    {
        id: "2",
        title: "Salário",
        amount: 3200,
        type: "income",
        date: "31/03/2026 09:00",
    },
    {
        id: "3",
        title: "Netflix",
        amount: 39.9,
        type: "expense",
        date: "30/03/2026 22:10",
    },
]