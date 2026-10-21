import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAdminMembers, setMemberRole } from '../../api/backend';
export default function AdminMembers(){
 const {token,member}=useAuth();const [members,setMembers]=useState([]),[error,setError]=useState('');
 const reload=()=>getAdminMembers(token).then(setMembers).catch(e=>setError(e.message));
 useEffect(()=>{reload()},[token]);
 async function change(m){const role=m.role==='admin'?'member':'admin';if(!window.confirm('เปลี่ยนบทบาทเป็น '+role+'?'))return;try{await setMemberRole(m.id,role,token);reload()}catch(e){setError(e.message)}}
 return <section><h2 className="text-xl font-semibold">จัดการสมาชิก</h2>{error&&<p role="alert" className="text-red-600">{error}</p>}<div className="mt-4 space-y-2">{members.map(m=><div key={m.id} className="flex items-center justify-between rounded-lg border p-3"><span>{m.displayName||m.email} ({m.role})</span><button disabled={String(m.id)===String(member?.id)} onClick={()=>change(m)} className="text-emerald-700 disabled:opacity-40">เปลี่ยนบทบาท</button></div>)}</div></section>;
}
