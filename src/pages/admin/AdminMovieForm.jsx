import {useEffect,useState} from 'react';
import {Link,useNavigate,useParams} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {createAdminMovie,updateAdminMovie,deleteAdminMovie,getAdminMovie,getGenres} from '../../api/backend';
import {ErrorBox,Loading,ConfirmBox,btnPrimary,btnDanger,inputClass} from '../../components/admin/AdminStates';

const EMPTY={id:'',title:'',titleTh:'',originalTitle:'',originalLanguage:'en',overview:'',overviewTh:'',posterPath:'',releaseDate:'',genreId:''};
function validate(form){
 const errors={};
 if(!form.title.trim())errors.title='ต้องมีชื่อเรื่อง';
 if(form.title.trim().length>255)errors.title='ชื่อเรื่องยาวเกิน 255 ตัวอักษร';
 if(form.originalLanguage.trim()&&form.originalLanguage.trim().length!==2)errors.originalLanguage='รหัสภาษาต้องมี 2 ตัวอักษร เช่น en หรือ th';
 if(form.posterPath.trim()&&!/^(\/|https?:\/\/)/.test(form.posterPath.trim()))errors.posterPath='ใช้ TMDB path หรือ URL ที่ขึ้นต้นด้วย http(s)';
 if(form.posterPath.trim().length>500)errors.posterPath='URL รูปยาวเกิน 500 ตัวอักษร';
 if(form.releaseDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(form.releaseDate)||Number.isNaN(new Date(form.releaseDate).getTime())))errors.releaseDate='วันฉายต้องเป็น YYYY-MM-DD';
 if(form.id&&!/^\d+$/.test(form.id))errors.id='เลขหนังต้องเป็นจำนวนเต็มบวก';
 return errors;
}
const nz=s=>s?.trim()||null;
const toPayload=f=>({
 title:f.title.trim(),titleTh:nz(f.titleTh),
 originalTitle:f.originalTitle.trim()||f.title.trim(),
 originalLanguage:f.originalLanguage.trim()||'en',
 overview:nz(f.overview),overviewTh:nz(f.overviewTh),posterPath:nz(f.posterPath),
 releaseDate:nz(f.releaseDate),genreId:f.genreId?Number(f.genreId):null
});
export default function AdminMovieForm(){
 const {id}=useParams(),isEdit=Boolean(id),{token}=useAuth(),navigate=useNavigate();
 const [form,setForm]=useState(EMPTY),[genres,setGenres]=useState([]),[impact,setImpact]=useState(null);
 const [status,setStatus]=useState('loading'),[loadError,setLoadError]=useState(null),[reload,setReload]=useState(0);
 const [errors,setErrors]=useState({}),[serverError,setServerError]=useState(''),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false);
 const [confirmDelete,setConfirmDelete]=useState(false),[deleting,setDeleting]=useState(false);
 useEffect(()=>{
  let active=true;setStatus('loading');setLoadError(null);
  Promise.all([getGenres(),isEdit?getAdminMovie(id,token):Promise.resolve(null)]).then(([gs,m])=>{
   if(!active)return;
   setGenres(gs);
   if(m){
    setForm({id:String(m.id),title:m.title||'',titleTh:m.titleTh||'',originalTitle:m.originalTitle||'',
     originalLanguage:m.originalLanguage||'en',overview:m.overview||'',overviewTh:m.overviewTh||'',
     posterPath:m.posterPath||'',releaseDate:m.releaseDate||'',genreId:m.genreId==null?'':String(m.genreId)});
    setImpact(m.impact);
   }else{setForm(EMPTY);setImpact(null)}
   setStatus('ready');
  }).catch(e=>{if(active){setLoadError(e);setStatus('error')}});
  return()=>{active=false};
 },[id,isEdit,token,reload]);
 const set=field=>e=>{setForm(prev=>({...prev,[field]:e.target.value}));setSaved(false);setErrors(prev=>({...prev,[field]:undefined}))};
 async function submit(e){
  e.preventDefault();
  const problems=validate(form);setErrors(problems);
  if(Object.keys(problems).length)return;
  setSaving(true);setServerError('');
  try{
   if(isEdit){const m=await updateAdminMovie(id,toPayload(form),token);setImpact(m.impact);setSaved(true)}
   else{const payload={...toPayload(form),id:form.id?Number(form.id):0};const m=await createAdminMovie(payload,token);
    navigate(`/admin/movies/${m.id}/edit`,{replace:true})}
  }catch(err){setServerError(err.message)}finally{setSaving(false)}
 }
 async function remove(){
  setDeleting(true);setServerError('');
  try{await deleteAdminMovie(id,token);navigate('/admin/movies',{replace:true})}
  catch(err){setServerError(err.message);setConfirmDelete(false)}
  finally{setDeleting(false)}
 }
 if(status==='loading')return <Loading/>;
 if(status==='error')return <ErrorBox error={loadError} onRetry={()=>setReload(n=>n+1)}/>;
 const poster=nz(form.posterPath);
 const posterPreview=poster?(poster.startsWith('http')?poster:`https://image.tmdb.org/t/p/w500${poster}`):null;
 const field=(key,label,type='text')=><label key={key} className="block text-sm font-medium text-slate-700">{label}
   <input type={type} className={inputClass+' mt-1'} value={form[key]} onChange={set(key)} disabled={saving||deleting||(isEdit&&key==='id')}/>
   {errors[key]&&<span className="text-xs text-red-600">{errors[key]}</span>}
  </label>;
 return <section>
  <div className="mb-4 flex items-center justify-between">
   <h2 className="text-xl font-semibold">{isEdit?`แก้ไขหนัง #${id}`:'เพิ่มหนังใหม่'}</h2>
   <Link className="text-sm text-emerald-700" to="/admin/movies">← กลับไปหน้าหนัง</Link>
  </div>
  {serverError&&<p role="alert" className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{serverError}</p>}
  {saved&&<p className="mb-4 rounded bg-emerald-50 p-3 text-emerald-700">บันทึกข้อมูลสำเร็จ</p>}
  <form onSubmit={submit} noValidate className="grid gap-6 md:grid-cols-[2fr_1fr]">
   <div className="space-y-4 rounded-xl border border-emerald-100 bg-white p-5">
    {!isEdit&&field('id','เลขหนัง (ไม่บังคับ — เว้นว่างให้ระบบสร้าง ID เริ่มที่ 9000000)')}
    <div className="grid gap-4 md:grid-cols-2">{field('title','ชื่อเรื่อง *')}{field('titleTh','ชื่อภาษาไทย')}{field('originalTitle','ชื่อต้นฉบับ')}{field('originalLanguage','ภาษาต้นฉบับ เช่น en/th')}</div>
    <label className="block text-sm font-medium">แนวหนัง
     <select className={inputClass+' mt-1'} value={form.genreId} onChange={set('genreId')} disabled={saving||deleting}>
      <option value="">ไม่ระบุแนว</option>{genres.map(g=><option key={g.id} value={g.id}>{g.nameTh||g.nameEn}</option>)}
     </select>
    </label>
    <label className="block text-sm font-medium">เรื่องย่อ
     <textarea rows={4} className={inputClass+' mt-1'} value={form.overview} onChange={set('overview')}/>
    </label>
    <label className="block text-sm font-medium">เรื่องย่อภาษาไทย
     <textarea rows={4} className={inputClass+' mt-1'} value={form.overviewTh} onChange={set('overviewTh')}/>
    </label>
    {field('posterPath','โปสเตอร์ (TMDB path หรือ URL)')}
    {field('releaseDate','วันฉาย (YYYY-MM-DD)','date')}
    <div className="flex flex-wrap gap-2"><button type="submit" className={btnPrimary} disabled={saving||deleting}>{saving?'กำลังบันทึก...':isEdit?'บันทึกการแก้ไข':'เพิ่มหนัง'}</button>
     {isEdit&&<button type="button" className={btnDanger} onClick={()=>setConfirmDelete(true)} disabled={saving||deleting}>ลบหนังเรื่องนี้</button>}
    </div>
   </div>
   <aside className="space-y-4 rounded-xl border border-emerald-100 bg-white p-5">
    <h3 className="font-medium">ตัวอย่างโปสเตอร์</h3>
    {posterPreview?<img src={posterPreview} alt="โปสเตอร์ตัวอย่าง" className="mx-auto max-h-64 rounded object-contain"/>:<div className="grid h-44 place-items-center rounded bg-slate-100 text-4xl">🎬</div>}
    {isEdit&&impact&&<><h3 className="font-medium">ข้อมูลที่ผูกกับหนัง</h3>
     <p className="text-sm">รีวิว {impact.reviews} • โหวต {impact.votes} • Wishlist {impact.wishlist}</p></>}
   </aside>
  </form>
  <ConfirmBox open={confirmDelete} title="ยืนยันการลบหนัง" busy={deleting} confirmText="ลบหนังถาวร" onCancel={()=>setConfirmDelete(false)} onConfirm={remove}>
   <p>ต้องการลบเรื่อง <strong>{form.title}</strong> หรือไม่? ไม่สามารถกู้คืนได้จากหน้าเว็บ</p>
   <p className="mt-2 text-red-700">รีวิว {impact?.reviews||0} รายการ • โหวต {impact?.votes||0} รายการ • Wishlist {impact?.wishlist||0} รายการ จะถูกลบตามไปด้วย</p>
  </ConfirmBox>
 </section>;
}
