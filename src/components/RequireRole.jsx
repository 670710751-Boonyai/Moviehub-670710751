import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireRole({ role, children }) {
  const { isLoggedIn, member } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  if (member?.role !== role) return <section className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-bold">403 — ไม่มีสิทธิ์เข้าถึง</h1><p>หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p></section>;
  return children;
}
