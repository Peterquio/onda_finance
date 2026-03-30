import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import DashboardPage from "./features/dashboard/pages/dashboard-page"
import { LoginPage } from "./pages/login-page"
import { useAuthStore } from "./features/auth/store/auth.store"

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
            </Routes>
        </BrowserRouter>
    )
}

export default App