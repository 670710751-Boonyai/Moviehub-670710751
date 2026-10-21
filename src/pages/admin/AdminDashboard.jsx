import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {getAdminStats} from '../../api/backend';
import {Loading,ErrorBox} from '../../components/admin/AdminStates';
function StatCard({label,value,to}){
 const body=<><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></>;
 const cls='block rounded-xl border border-emerald-100 bg-white p-4';
 return to?<Link to={to} className={cls+' hover:border-emerald-300'}>{body}</Link>:<div className={cls}>{body}</div>;
}
const dateTH=iso=>new Date(iso).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
export default function AdminDashboard(){
 const {token}=useAuth();
 const [stats,setStats]=useState(null),[status,setStatus]=useState('loading'),[error,setError]=useState(null),[reload,setReload]=useState(0);
 useEffect(()=>{
  let active=true;setStatus('loading');setError(null);
  getAdminStats(token).then(data=>{if(active){setStats(data);setStatus('success')}})
   .catch(e=>{if(active){setError(e);setStatus('error')}});
  return()=>{active=false};
 },[token,reload]);
 if(status==='loading')return <Loading/>;
 if(status==='error')return <ErrorBox error={error} onRetry={()=>setReload(n=>n+1)}/>;
 return <div className="space-y-8">
  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
   <StatCard label="หนัง" value={stats.movies} to="/admin/movies"/>
   <StatCard label="สมาชิก" value={stats.members} to="/admin/members"/>
   <StatCard label="admin" value={stats.admins}/>
   <StatCard label="โหวต" value={stats.votes}/>
   <StatCard label="อยากดู" value={stats.wishlistItems}/>
  </div>
  <div className="grid gap-6 md:grid-cols-2">
   <section className="rounded-xl border border-emerald-100 bg-white p-4">
    <h2 className="font-semibold">หนังที่สมาชิกให้คะแนนสูงสุด</h2>
    <p className="text-xs text-slate-500">คะแนนจากสมาชิกเว็บไซต์ ไม่ใช่คะแนน TMDB</p>
    {(stats.topVoted||[]).length===0?<p className="py-6 text-sm text-slate-500">ยังไม่มีใครโหวต</p>:
    <ol className="mt-3 divide-y divide-slate-100">{stats.topVoted.map((m,i)=><li key={m.id} className="flex items-center gap-3 py-2">
     <span className="w-5 text-sm text-slate-500">{i+1}</span>
     {m.poster?<img src={m.poster} className="h-12 w-8 rounded object-cover" alt=""/>:<span>🎬</span>}
     <div className="min-w-0 flex-1"><Link className="block truncate text-sm text-emerald-700" to={`/movies/${m.id}`}>{m.title}</Link>
      {m.titleTh&&<p className="truncate text-xs text-slate-500">{m.titleTh}</p>}</div>
     <span className="text-sm">⭐ {m.voteAverage} ({m.voteCount})</span>
    </li>)}</ol>}
   </section>
   <section className="rounded-xl border border-emerald-100 bg-white p-4">
    <h2 className="font-semibold">สมาชิกใหม่ล่าสุด</h2>
    {(stats.newestMembers||[]).length===0?<p className="py-6 text-sm text-slate-500">ยังไม่มีสมาชิก</p>:
    <ul className="mt-3 divide-y divide-slate-100">{stats.newestMembers.map(m=><li key={m.id} className="flex justify-between gap-3 py-2 text-sm">
     <div><p className="font-medium">{m.displayName}</p><p className="text-xs text-slate-500">{m.email}</p></div>
     <div className="text-right text-xs text-slate-500">{m.role==='admin'&&<p>Admin</p>}{dateTH(m.createdAt)}</div>
    </li>)}</ul>}
    <Link to="/admin/members" className="mt-3 inline-block text-sm text-emerald-700">ดูสมาชิกทั้งหมด →</Link>
   </section>
  </div>
 </div>;
}
