import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {getMovies} from '../../api/backend';
import {ErrorBox,Loading,btnPrimary,inputClass} from '../../components/admin/AdminStates';
export default function AdminMovies(){
 const [movies,setMovies]=useState([]),[status,setStatus]=useState('loading'),[error,setError]=useState(null),[query,setQuery]=useState(''),[reload,setReload]=useState(0);
 useEffect(()=>{
  let active=true;setStatus('loading');setError(null);
  getMovies().then(items=>{if(active){setMovies(items);setStatus('success')}})
   .catch(e=>{if(active){setError(e);setStatus('error')}});
  return()=>{active=false};
 },[reload]);
 const q=query.trim().toLowerCase();
 const shown=movies.filter(m=>!q||m.title.toLowerCase().includes(q)||(m.titleTh||'').toLowerCase().includes(q)||String(m.id).includes(q));
 return <section>
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
   <div><h2 className="text-xl font-semibold">หนังทั้งหมด</h2>{status==='success'&&<p className="text-sm text-slate-500">แสดง {shown.length} จาก {movies.length} เรื่อง</p>}</div>
   <div className="flex flex-wrap gap-2">
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นชื่อหนัง หรือเลข ID" className={inputClass}/>
    <Link to="/admin/movies/new" className={btnPrimary}>+ เพิ่มหนัง</Link>
   </div>
  </div>
  {status==='loading'&&<Loading/>}
  {status==='error'&&<ErrorBox error={error} onRetry={()=>setReload(n=>n+1)}/>}
  {status==='success'&&<div className="overflow-x-auto rounded-xl border border-emerald-100 bg-white">
   <table className="w-full text-left text-sm">
    <thead className="bg-emerald-50"><tr><th className="px-4 py-3">หนัง</th><th className="px-4 py-3">แนว</th><th className="px-4 py-3">ปี</th><th className="px-4 py-3">คะแนน</th><th className="px-4 py-3 text-right">จัดการ</th></tr></thead>
    <tbody className="divide-y divide-slate-100">{shown.map(m=><tr key={m.id}>
     <td className="px-4 py-2"><div className="flex items-center gap-3">
      {m.poster?<img src={m.poster} alt="" className="h-12 w-8 rounded object-cover"/>:<span>🎬</span>}
      <div><p className="font-medium">{m.title}</p><p className="text-xs text-slate-500">#{m.id} {m.titleTh||''}</p></div>
     </div></td>
     <td className="px-4 py-2">{m.genre||'—'}</td>
     <td className="px-4 py-2">{m.year||'—'}</td>
     <td className="px-4 py-2">⭐ {m.rating}</td>
     <td className="px-4 py-2 text-right"><Link className="text-emerald-700 hover:underline" to={`/admin/movies/${m.id}/edit`}>แก้ไข</Link></td>
    </tr>)}
     {shown.length===0&&<tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">ไม่พบหนังที่ค้นหา</td></tr>}
    </tbody>
   </table>
  </div>}
 </section>;
}
