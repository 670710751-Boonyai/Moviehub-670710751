import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { getMovies } from '../api/backend';

export default function Movies() {
  const [query,setQuery]=useState('');
  const [genre,setGenre]=useState('all');
  const [movies,setMovies]=useState([]);
  const [status,setStatus]=useState('loading');
  const [error,setError]=useState(null);
  const [reloadKey,setReloadKey]=useState(0);
  useEffect(()=>{
    let active=true;
    setStatus('loading');setError(null);
    getMovies().then(list=>{if(active){setMovies(list);setStatus('success')}})
      .catch(err=>{if(active){setError(err);setStatus('error')}});
    return ()=>{active=false};
  },[reloadKey]);
  const genres=[...new Set(movies.map(m=>m.genre).filter(Boolean))];
  const q=query.trim().toLowerCase();
  const shown=movies.filter(m=>
    (genre==='all'||m.genre===genre) &&
    (m.title.toLowerCase().includes(q)||(m.titleTh||'').toLowerCase().includes(q))
  );
  const chipClass=(active)=>'rounded-full border px-3 py-1 text-sm transition '+(active?'border-emerald-500 bg-emerald-500 text-white':'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50');
  return <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><h1 className="text-2xl font-semibold text-slate-900">หนังทั้งหมด</h1>
      <p className="text-sm text-slate-500">ข้อมูลจาก MovieHub Go API {status==='success'&&`| พบ ${shown.length} จาก ${movies.length} เรื่อง`}</p></div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหาชื่อหนัง..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 md:w-72" />
    </div>
    <div className="mb-6 flex flex-wrap gap-2">
      <button className={chipClass(genre==='all')} onClick={()=>setGenre('all')}>ทุกแนว</button>
      {genres.map(g=><button key={g} className={chipClass(genre===g)} onClick={()=>setGenre(g)}>{g}</button>)}
    </div>
    <MovieGrid movies={shown} status={status} error={error} onRetry={()=>setReloadKey(x=>x+1)} />
  </div>;
}
