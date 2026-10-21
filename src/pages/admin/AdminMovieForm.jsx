import { useEffect,useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { createAdminMovie,updateAdminMovie,getAdminMovie,getGenres } from '../../api/backend';

const empty = {id:'0',title:'',titleTh:'',originalTitle:'',originalLanguage:'en',overview:'',overviewTh:'',posterPath:'',releaseDate:'',genreId:''};
const optional=value=>value?.trim()||null;
export default function AdminMovieForm(){
 const {id}=useParams(),edit=Boolean(id),navigate=useNavigate(),{token}=useAuth();
 const [form,setForm]=useState(empty),[genres,setGenres]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{
  let active=true;
  getGenres().then(items=>{if(active)setGenres(items)}).catch(e=>{if(active)setError(e.message)});
  if(edit)getAdminMovie(id,token).then(m=>{
   if(!active)return;
   setForm({
    id:String(m.id),title:m.title||'',titleTh:m.titleTh||'',originalTitle:m.originalTitle||'',
    originalLanguage:m.originalLanguage||'en',overview:m.overview||'',overviewTh:m.overviewTh||'',
    posterPath:m.posterPath||'',releaseDate:m.releaseDate||'',genreId:m.genreId==null?'':String(m.genreId)
   });
  }).catch(e=>{if(active)setError(e.message)});
  return()=>{active=false};
 },[edit,id,token]);
 const field=name=>event=>setForm(prev=>({...prev,[name]:event.target.value}));
 async function submit(event){
  event.preventDefault();setBusy(true);setError('');
  const body={
   id:Number(form.id),title:form.title,originalTitle:form.originalTitle||form.title,
   originalLanguage:form.originalLanguage||'en',titleTh:optional(form.titleTh),
   overview:optional(form.overview),overviewTh:optional(form.overviewTh),
   posterPath:optional(form.posterPath),releaseDate:optional(form.releaseDate),
   genreId:form.genreId===''?null:Number(form.genreId)
  };
  try{if(edit)await updateAdminMovie(id,body,token);else await createAdminMovie(body,token);navigate('/admin/movies')}
  catch(e){setError(e.message)}finally{setBusy(false)}
 }
 const fields=[['id','เลขหนัง (0 = ให้ระบบสร้าง ID)','number'],['title','ชื่อหนัง','text'],['titleTh','ชื่อไทย','text'],['originalTitle','ชื่อต้นฉบับ','text'],['originalLanguage','รหัสภาษา เช่น en/th','text'],['posterPath','Poster path หรือ URL','text'],['releaseDate','วันฉาย','date']];
 return <section className="max-w-xl">
  <h2 className="mb-4 text-xl font-semibold">{edit?'แก้ไขหนัง':'เพิ่มหนัง'}</h2>
  {error&&<p role="alert" className="mb-3 text-red-600">{error}</p>}
  <form onSubmit={submit} className="space-y-4">
   {fields.map(([key,label,type])=><label key={key} className="block text-sm">{label}
    <input className="mt-1 block w-full rounded border p-2" type={type} min={key==='id'?'0':undefined}
     value={form[key]} onChange={field(key)} disabled={edit&&key==='id'} required={key==='title'||key==='id'}/>
   </label>)}
   <label className="block text-sm">แนวหนัง
    <select className="mt-1 block w-full rounded border p-2" value={form.genreId} onChange={field('genreId')}>
     <option value="">ไม่ระบุแนว</option>
     {genres.map(g=><option key={g.id} value={g.id}>{g.nameTh||g.nameEn}</option>)}
    </select>
   </label>
   <label className="block text-sm">เรื่องย่อ
    <textarea className="mt-1 block w-full rounded border p-2" rows={4} value={form.overview} onChange={field('overview')}/>
   </label>
   <label className="block text-sm">เรื่องย่อภาษาไทย
    <textarea className="mt-1 block w-full rounded border p-2" rows={4} value={form.overviewTh} onChange={field('overviewTh')}/>
   </label>
   <button type="submit" disabled={busy} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">{busy?'กำลังบันทึก...':'บันทึก'}</button>
  </form>
 </section>;
}
