import { useState } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
export default function Login(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const {login}=useAuth(),navigate=useNavigate(),location=useLocation();
 const from=location.state?.from?.pathname||'/';
 async function submit(e){e.preventDefault();setBusy(true);setError('');
  try{await login(email,password);navigate(from,{replace:true})}
  catch(err){setError(err.message)}finally{setBusy(false)}
 }
 return <div className="mx-auto max-w-sm px-4 py-12">
  <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>
  <form className="mt-6 space-y-3" onSubmit={submit}>
   <input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="อีเมล" required className="w-full rounded border p-3"/>
   <input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="รหัสผ่าน" required className="w-full rounded border p-3"/>
   <button disabled={busy} className="w-full rounded bg-emerald-500 px-4 py-2 text-white disabled:opacity-50">{busy?'กำลังเข้าสู่ระบบ...':'เข้าสู่ระบบ'}</button>
   {error&&<p role="alert" className="text-red-600">{error}</p>}
  </form>
  <p className="mt-6 text-sm">ยังไม่มีบัญชี? <Link to="/register" className="text-emerald-600">สมัครสมาชิก</Link></p>
 </div>;
}
