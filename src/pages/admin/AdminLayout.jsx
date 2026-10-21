import { NavLink, Outlet } from 'react-router-dom';
export default function AdminLayout() {
 return <div className="mx-auto max-w-5xl px-4 py-8">
 <h1 className="text-3xl font-bold text-slate-800">MovieHub Backoffice</h1>
 <nav className="my-6 flex flex-wrap gap-4 border-b pb-4">
 <NavLink end to="/admin">ภาพรวม</NavLink>
 <NavLink to="/admin/movies">จัดการหนัง</NavLink>
 <NavLink to="/admin/members">สมาชิก</NavLink>
 </nav><Outlet /></div>;
}
