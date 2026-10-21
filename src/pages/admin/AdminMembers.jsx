import {useEffect,useState} from 'react';
import {useAuth} from '../../auth/AuthContext';
import {getAdminMembers,setMemberRole} from '../../api/backend';
import {ErrorBox,Loading,ConfirmBox,inputClass,btnGhost} from '../../components/admin/AdminStates';
const dateTH=iso=>new Date(iso).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
export default function AdminMembers(){
 const {token,member:me}=useAuth();
 const [members,setMembers]=useState([]),[status,setStatus]=useState('loading'),[error,setError]=useState(null);
 const [query,setQuery]=useState(''),[target,setTarget]=useState(null),[busy,setBusy]=useState(false),[actionError,setActionError]=useState(''),[reload,setReload]=useState(0);
 useEffect(()=>{
  let active=true;setStatus('loading');setError(null);
  getAdminMembers(token).then(items=>{if(active){setMembers(items);setStatus('success')}})
   .catch(e=>{if(active){setError(e);setStatus('error')}});
  return()=>{active=false};
 },[token,reload]);
 async function confirmRole(){
  if(!target)return;
  setBusy(true);setActionError('');
  const role=target.role==='admin'?'member':'admin';
  try{const updated=await setMemberRole(target.id,role,token);
   setMembers(prev=>prev.map(m=>m.id===updated.id?updated:m));setTarget(null)}
  catch(e){setActionError(e.message)}finally{setBusy(false)}
 }
 const q=query.trim().toLowerCase();
 const shown=members.filter(m=>!q||m.displayName.toLowerCase().includes(q)||m.email.toLowerCase().includes(q)||String(m.id).includes(q));
 return <section>
  <h2 className="text-xl font-semibold">จัดการสมาชิก</h2>
  <div className="my-4 flex flex-wrap gap-2"><input className={inputClass} placeholder="ค้นหาสมาชิกหรืออีเมล" value={query} onChange={e=>setQuery(e.target.value)}/></div>
  {status==='loading'&&<Loading/>}
  {status==='error'&&<ErrorBox error={error} onRetry={()=>setReload(n=>n+1)}/>}
  {status==='success'&&<div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white">
   <table className="w-full text-left text-sm">
    <thead className="bg-emerald-50"><tr><th className="px-4 py-3">สมาชิก</th><th className="px-4 py-3">บทบาท</th><th className="px-4 py-3">สมัครเมื่อ</th><th className="px-4 py-3">จัดการ</th></tr></thead>
    <tbody className="divide-y divide-slate-100">{shown.map(m=><tr key={m.id}>
     <td className="px-4 py-3"><p className="font-medium">{m.displayName}</p><p className="text-xs text-slate-500">{m.email}</p></td>
     <td className="px-4 py-3">{m.role}</td>
     <td className="px-4 py-3">{dateTH(m.createdAt)}</td>
     <td className="px-4 py-3"><button type="button" className={btnGhost} disabled={String(m.id)===String(me?.id)} onClick={()=>{setActionError('');setTarget(m)}}>{String(m.id)===String(me?.id)?'บัญชีของคุณ':m.role==='admin'?'ลดเป็น member':'เลื่อนเป็น admin'}</button></td>
    </tr>)}
    {shown.length===0&&<tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">ไม่พบสมาชิก</td></tr>}
    </tbody>
   </table>
  </div>}
  <ConfirmBox open={Boolean(target)} busy={busy} title="ยืนยันการเปลี่ยนบทบาท" confirmText="เปลี่ยนบทบาท" onCancel={()=>setTarget(null)} onConfirm={confirmRole}>
   <p>ต้องการเปลี่ยน {target?.displayName} จาก {target?.role} เป็น {target?.role==='admin'?'member':'admin'} หรือไม่?</p>
   <p className="mt-2">สมาชิกต้องเข้าสู่ระบบใหม่เพื่อรับ JWT บทบาทล่าสุด</p>
   {actionError&&<p role="alert" className="mt-2 text-red-600">{actionError}</p>}
  </ConfirmBox>
 </section>;
}
