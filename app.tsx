import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./features/dashboard/pages/dashboard-page";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;