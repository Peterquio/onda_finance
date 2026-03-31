import type { PixContact } from "../types/pix.types"

type PixContactCardProps = {
    contact: PixContact
    onSelect: (contact: PixContact) => void
}

export function PixContactCard({ contact, onSelect }: PixContactCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(contact)}
            className="w-full rounded-2xl border p-4 text-left transition hover:bg-muted"
        >
            <p className="font-semibold">{contact.name}</p>
            <p className="text-sm text-muted-foreground">{contact.pixKey}</p>
            <p className="text-xs text-muted-foreground">{contact.bankName}</p>
        </button>
    )
}