import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import DashboardPage from "./features/dashboard/pages/dashboard-page"
import { LoginPage } from "./pages/login-page"
import { useAuthStore } from "./features/auth/store/auth.store"
import PixContactsPage from "./features/pix/pages/pix-contacts-page"
import PixAmountPage from "./features/pix/pages/pix-amount-page"
import PixAuthPage from "./features/pix/pages/pix-auth-page"
import PixReceiptPage from "./features/pix/pages/pix-receipt-page"
import SetupPixSecurityPage from "./features/auth/pages/setup-pix-security-page"
import ChangePixPasswordPage from "./features/auth/pages/change-pix-password-page"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LOGIN */}
                <Route path="/" element={<LoginPage />} />

                {/* DASHBOARD PROTEGIDO */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                {/* PIX */}
                <Route
                    path="/pix"
                    element={
                        <ProtectedRoute>
                            <PixContactsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pix/amount"
                    element={
                        <ProtectedRoute>
                            <PixAmountPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pix/auth"
                    element={
                        <ProtectedRoute>
                            <PixAuthPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pix/receipt"
                    element={
                        <ProtectedRoute>
                            <PixReceiptPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/setup-pix-security"
                    element={
                        <ProtectedRoute>
                            <SetupPixSecurityPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings/change-pix-password"
                    element={
                        <ProtectedRoute>
                            <ChangePixPasswordPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App