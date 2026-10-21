import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAdminStats } from '../../api/backend';
export default function AdminDashboard() {
 const { token }=useAuth();
 const [stats,setStats]=useState(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;getAdminStats(token).then(data=>{if(active)setStats(data)}).catch(err=>{if(active)setError(err.message)});return()=>{active=false}},[token]);
 if(error)return <p role="alert" className="text-red-600">{error}</p>;
 if(!stats)return <p>กำลังโหลดข้อมูล...</p>;
 return <div className="grid gap-4 sm:grid-cols-3">{Object.entries(stats).map(([key,value])=><div key={key} className="rounded-xl border p-5"><p className="text-slate-500">{key}</p><strong className="text-3xl">{typeof value==='object'?JSON.stringify(value):value}</strong></div>)}</div>;
}
