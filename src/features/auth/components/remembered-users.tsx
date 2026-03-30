import type { LocalUser } from '../types/auth.types'

type RememberedUsersProps = {
    users: LocalUser[]
    onSelectUser: (username: string) => void
}

export function RememberedUsers({
    users,
    onSelectUser,
}: RememberedUsersProps) {
    if (users.length === 0) {
        return (
            <div className="rounded-2xl border p-4">
                <p className="text-sm font-medium">Usuários deste dispositivo</p>
                <p className="text-muted-foreground mt-1 text-sm">
                    Nenhum usuário foi cadastrado ainda.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3 rounded-2xl border p-4">
            <div className="space-y-1">
                <p className="text-sm font-medium">Usuários deste dispositivo</p>
                <p className="text-muted-foreground text-sm">
                    Clique em um usuário para preencher o login mais rápido.
                </p>
            </div>

            <div className="grid gap-2">
                {users.map((user) => (
                    <button
                        key={user.id}
                        type="button"
                        onClick={() => onSelectUser(user.username)}
                        className="flex items-center justify-between rounded-xl border px-4 py-3 text-left transition hover:bg-accent"
                    >
                        <div>
                            <p className="text-sm font-medium">{user.fullName}</p>
                            <p className="text-muted-foreground text-sm">@{user.username}</p>
                        </div>

                        <span className="text-muted-foreground text-xs">
                            Usar login
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}