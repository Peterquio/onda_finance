import { create } from "zustand"

type DashboardStore = {
    balance: number
    limit: number
    receiveTransfer: (amount: number) => void
    decreaseBalance: (amount: number) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    balance: 2480.35,
    limit: 1500,

    receiveTransfer: (amount) =>
        set((state) => ({
            balance: state.balance + amount,
        })),

    decreaseBalance: (amount) =>
        set((state) => ({
            balance: state.balance - amount,
        })),
}))