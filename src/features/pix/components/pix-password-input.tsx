type PixPasswordInputProps = {
    value: string
    onChange: (value: string) => void
}

export function PixPasswordInput({ value, onChange }: PixPasswordInputProps) {
    function handleChange(input: string) {
        const digitsOnly = input.replace(/\D/g, "").slice(0, 4)
        onChange(digitsOnly)
    }

    return (
        <div className="space-y-2">
            <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 text-center text-2xl tracking-[0.6em]"
                placeholder="••••"
            />

            <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((index) => (
                    <span
                        key={index}
                        className={`h-3 w-3 rounded-full ${value[index] ? "bg-foreground" : "bg-muted"}`}
                    />
                ))}
            </div>
        </div>
    )
}