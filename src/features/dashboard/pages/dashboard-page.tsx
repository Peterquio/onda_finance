import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../store/dashboard.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
    Bell,
    Bug,
    ChevronRight,
    Eye,
    EyeOff,
    Menu,
    MoreHorizontal,
    Receipt,
    Search,
    Send,
    Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuickAction = {
    label: string;
    icon: React.ElementType;
};

const quickActions: QuickAction[] = [
    { label: "Pix", icon: Send },
    { label: "Transferências", icon: Wallet },
    { label: "Extrato", icon: Receipt },
    { label: "Mais ações", icon: MoreHorizontal },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

function QuickActionButton({
    label,
    icon: Icon,
    onClick,
    isActive = false,
}: QuickAction & { onClick?: () => void; isActive?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex flex-col items-center gap-2 text-center"
        >
            <div
                className={`flex h-16 w-16 items-center justify-center rounded-full border shadow-sm transition-all duration-200
                ${isActive
                        ? "scale-100 border-green-600 bg-green-600 text-white"
                        : "border-border bg-white text-primary group-hover:scale-110 group-hover:border-green-600 group-hover:bg-green-600 group-hover:text-white active:scale-100"
                    }`}
            >
                <Icon className="h-6 w-6" />
            </div>

            <span
                className={`max-w-[88px] text-xs font-medium leading-tight transition-colors sm:text-sm ${isActive ? "text-green-700" : "text-muted-foreground group-hover:text-green-700"
                    }`}
            >
                {label}
            </span>
        </button>
    );
}

function DebugTransferButton({
    value,
    onReceive,
}: {
    value: number;
    onReceive: (amount: number) => void;
}) {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={() => onReceive(value)}
            className="h-auto w-full justify-between rounded-2xl border-dashed px-4 py-4 text-left"
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                    <Bug className="h-4 w-4" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-foreground">Ação de debug</p>
                    <p className="text-sm text-muted-foreground">
                        Clique para receber uma transferência de {currencyFormatter.format(value)}.
                    </p>
                </div>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const currentUser = useAuthStore((state) => state.user);

    const [showBalance, setShowBalance] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStatementOpen, setIsStatementOpen] = useState(false);

    const balance = useDashboardStore((state) => state.balance);
    const limit = useDashboardStore((state) => state.limit);
    const transactions = useDashboardStore((state) => state.transactions);
    const receiveTransfer = useDashboardStore((state) => state.receiveTransfer);

    const totalWithLimit = useMemo(() => balance + limit, [balance, limit]);

    const handleDebugTransfer = (amount: number) => {
        receiveTransfer(amount);
    };
    const handleQuickAction = (label: string) => {
        if (label === "Pix") {
            navigate("/pix");
            return;
        }

        if (label === "Extrato") {
            setIsStatementOpen((current) => !current);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 p-4 sm:p-6">
            <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                <header className="flex items-center justify-between rounded-3xl border bg-card/90 px-4 py-3 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((current) => !current)}
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Abrir menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
                                Onda Finance
                            </p>
                            <h1 className="text-base font-semibold text-foreground">
                                Seu banco digital
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Buscar"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        <button
                            type="button"
                            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Notificações"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                    </div>
                </header>
                {isMenuOpen && (
                    <div className="rounded-2xl border bg-card p-2 shadow-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate("/settings/change-pix-password");
                            }}
                            className="w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-accent"
                        >
                            Trocar senha PIX
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsMenuOpen(false);
                                logout();
                                navigate("/");
                            }}
                            className="w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-accent"
                        >
                            Deslogar
                        </button>
                    </div>
                )}
                <section className="px-1">
                    <p className="text-sm text-muted-foreground">Bem-vindo</p>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {currentUser?.fullName ?? "Cliente"}
                    </h2>
                </section>

                <Card className="overflow-hidden rounded-3xl border-0 bg-primary text-primary-foreground shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm/none opacity-90">Saldo total</p>
                                <CardTitle className="mt-3 text-3xl font-bold tracking-tight">
                                    {showBalance ? currencyFormatter.format(balance) : "R$ ••••••"}
                                </CardTitle>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowBalance((current) => !current)}
                                className="rounded-full bg-white/15 p-2 transition-colors hover:bg-white/20"
                                aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                            >
                                {showBalance ? (
                                    <Eye className="h-5 w-5" />
                                ) : (
                                    <EyeOff className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                                Saldo + limite
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {showBalance ? currencyFormatter.format(totalWithLimit) : "R$ ••••••"}
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-3 rounded-2xl bg-background/10 p-3 backdrop-blur-sm">
                            {quickActions.map((action) => (
                                <QuickActionButton
                                    key={action.label}
                                    {...action}
                                    onClick={() => handleQuickAction(action.label)}
                                    isActive={action.label === "Extrato" && isStatementOpen}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <section className="space-y-3">
                    <div className="px-1">
                        <h3 className="text-sm font-semibold text-foreground">
                            Área de desenvolvimento
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Use estes atalhos para simular entradas de dinheiro em conta.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <DebugTransferButton value={100} onReceive={handleDebugTransfer} />
                        <DebugTransferButton value={1000} onReceive={handleDebugTransfer} />
                    </div>
                </section>
                {isStatementOpen && (
                    <section className="space-y-3">
                        <div className="px-1">
                            <h3 className="text-sm font-semibold text-foreground">Extrato</h3>
                            <p className="text-sm text-muted-foreground">
                                Últimas movimentações da sua conta.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {transactions.map((transaction) => {
                                const isIncome = transaction.type === "income";

                                return (
                                    <Card
                                        key={transaction.id}
                                        className="rounded-2xl border bg-card shadow-sm"
                                    >
                                        <CardContent className="flex items-center justify-between gap-4 p-4">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-foreground">
                                                    {transaction.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {transaction.date}
                                                </p>
                                            </div>

                                            <p
                                                className={`shrink-0 text-sm font-bold ${isIncome ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {isIncome ? "+" : "-"}{" "}
                                                {currencyFormatter.format(transaction.amount)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}