import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { createAdminMovie, updateAdminMovie, getMovie } from '../../api/backend';

export default function AdminMovieForm(){
 const {id}=useParams(),edit=Boolean(id),navigate=useNavigate(),{token}=useAuth();
 const [form,setForm]=useState({id:'',title:'',originalTitle:'',originalLanguage:'en',overview:'',posterPath:''});
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{if(!edit)return;let active=true;getMovie(id).then(data=>{if(!active)return;const m=data.movie||data;setForm({id:String(m.id),title:m.title||'',originalTitle:m.originalTitle||m.title||'',originalLanguage:m.originalLanguage||'en',overview:m.overview||'',posterPath:m.posterPath||''})}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[id,edit]);
 const field=(name)=>(e)=>setForm(prev=>({...prev,[name]:e.target.value}));
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const body={...form,id:Number(form.id)};if(edit)await updateAdminMovie(id,body,token);else await createAdminMovie(body,token);navigate('/admin/movies')}catch(err){setError(err.message)}finally{setBusy(false)}}
 return <section className="max-w-xl"><h2 className="mb-4 text-xl font-semibold">{edit?'แก้ไขหนัง':'เพิ่มหนัง'}</h2>{error&&<p role="alert" className="text-red-600">{error}</p>}<form onSubmit={submit} className="space-y-4">{[['id','TMDB Movie ID'],['title','ชื่อหนัง'],['originalTitle','ชื่อต้นฉบับ'],['originalLanguage','รหัสภาษา (en/th)'],['posterPath','Poster path']].map(([key,label])=><label key={key} className="block text-sm">{label}<input className="mt-1 block w-full rounded border p-2" value={form[key]} onChange={field(key)} disabled={edit&&key==='id'} required={key==='id'||key==='title'}/></label>)}<label className="block text-sm">เรื่องย่อ<textarea className="mt-1 block w-full rounded border p-2" value={form.overview} onChange={field('overview')}/></label><button disabled={busy} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">{busy?'กำลังบันทึก...':'บันทึก'}</button></form></section>;
}
