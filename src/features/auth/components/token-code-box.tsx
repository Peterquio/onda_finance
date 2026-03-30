type TokenCodeBoxProps = {
    code: string
    onRefresh: () => void
}

export function TokenCodeBox({
    code,
    onRefresh,
}: TokenCodeBoxProps) {
    return (
        <div className="space-y-3 rounded-2xl border p-4">
            <div className="space-y-1">
                <p className="text-sm font-medium">Código de verificação</p>
                <p className="text-muted-foreground text-sm">
                    Digite o código exibido abaixo para simular o token de acesso.
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/40 px-4 py-3">
                <span className="select-none text-2xl font-bold tracking-[0.35em]">
                    {code}
                </span>

                <button
                    type="button"
                    onClick={onRefresh}
                    className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-accent"
                >
                    Gerar outro
                </button>
            </div>
        </div>
    )
}