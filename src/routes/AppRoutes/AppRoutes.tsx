import {Routes, Route , Navigate} from 'react-router-dom';
import { DashboardPage } from '../../pages/DashboardPage/DashboardPage';
import { Staks } from '../../pages/Staks/Staks';



export const AppRoutes = () => {
    return (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/staks" element={<Staks />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/cripto" />} />
    </Routes>
    )
}