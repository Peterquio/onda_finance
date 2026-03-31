type PixKeypadProps = {
    onKeyPress: (key: string) => void
    onBackspace: () => void
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

export function PixKeypad({ onKeyPress, onBackspace }: PixKeypadProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {keys.slice(0, 9).map((key) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onKeyPress(key)}
                    className="rounded-2xl border p-5 text-xl font-semibold hover:bg-muted"
                >
                    {key}
                </button>
            ))}

            <div />

            <button
                type="button"
                onClick={() => onKeyPress("0")}
                className="rounded-2xl border p-5 text-xl font-semibold hover:bg-muted"
            >
                0
            </button>

            <button
                type="button"
                onClick={onBackspace}
                className="rounded-2xl border p-5 text-xl font-semibold hover:bg-muted"
            >
                ←
            </button>
        </div>
    )
}