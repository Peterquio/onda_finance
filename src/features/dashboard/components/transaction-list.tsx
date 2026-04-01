import { useDashboardStore } from "../store/dashboard.store"
import type { Transaction } from "../types/transaction"

function TransactionItem({ transaction }: { transaction: Transaction }) {
    const isIncome = transaction.type === "income"

    return (
        <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
                <p className="text-sm font-medium">{transaction.title}</p>
                <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>

            <p
                className={`text-sm font-semibold ${isIncome ? "text-green-600" : "text-red-600"
                    }`}
            >
                {isIncome ? "+" : "-"} R$ {transaction.amount.toFixed(2).replace(".", ",")}
            </p>
        </div>
    )
}

export function TransactionList() {
    const transactions = useDashboardStore((state) => state.transactions)

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
        </div>
    )
}