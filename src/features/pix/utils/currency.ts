export function formatCurrencyBRL(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
}

/**
 * Recebe apenas dígitos e transforma em valor monetário.
 * Exemplo:
 * "1" => 0.01
 * "12" => 0.12
 * "123" => 1.23
 */
export function digitsToMoney(digits: string): number {
    const numeric = digits.replace(/\D/g, "")
    if (!numeric) return 0
    return Number(numeric) / 100
}

export function moneyToDigits(value: number): string {
    return Math.round(value * 100).toString()
}