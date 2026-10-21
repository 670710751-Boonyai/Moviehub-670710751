import { useEffect,useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import MovieActions from '../components/MovieActions';
import { getMovie,getReviews,postReview } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
export default function MovieDetail(){
 const {id}=useParams(),{token,member,isLoggedIn}=useAuth();
 const [movie,setMovie]=useState(null),[reviews,setReviews]=useState([]),[error,setError]=useState('');
 useEffect(()=>{
  let active=true;setMovie(null);setError('');setReviews([]);
  getMovie(id).then(data=>{if(active)setMovie(data.movie||data)})
   .catch(e=>{if(active)setError(e.message)});
  getReviews(id).then(data=>{if(active)setReviews(data.items||[])})
   .catch(()=>{if(active)setReviews([])});
  return()=>{active=false};
 },[id]);
 async function submit(text){
  const saved=await postReview(id,text,token);
  setReviews(previous=>[saved,...previous.filter(r=>r.memberId!==member.id)]);
 }
 if(error)return <div role="alert" className="mx-auto max-w-4xl p-10 text-red-600">{error} <Link to="/movies">กลับไปหน้าหนัง</Link></div>;
 if(!movie)return <p className="mx-auto max-w-4xl p-10">กำลังโหลดหนัง...</p>;
 return <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
  <Link to="/movies" className="text-sm text-emerald-600">กลับไปหน้าหนังทั้งหมด</Link>
  <div className="mt-4 flex flex-col gap-8 md:flex-row">
   {movie.poster?<img className="w-48 shrink-0 self-start rounded-xl" src={movie.poster} alt={movie.title}/>:<div className="grid aspect-[2/3] w-48 place-items-center bg-slate-100 text-5xl">🎬</div>}
   <div className="flex-1">
    <h1 className="text-2xl font-semibold">{movie.title}</h1>
    {movie.titleTh&&<p className="mt-1 text-slate-500">{movie.titleTh}</p>}
    <p className="mt-2 text-sm text-slate-500">{movie.year}{movie.genre&&` | ${movie.genre}`}{movie.rating!=null&&` | ⭐ ${movie.rating}`}</p>
    <p className="mt-4 leading-relaxed text-slate-700">{movie.detail}</p>
    <MovieActions key={movie.id} movieId={movie.id}/>
    <section className="mt-8"><h2 className="mb-3 text-lg font-semibold">รีวิวจากสมาชิก ({reviews.length})</h2><ReviewList items={reviews}/></section>
    <section className="mt-6 rounded-xl border border-emerald-100 bg-white p-5">
     {isLoggedIn?<ReviewForm key={movie.id} movieTitle={movie.title} onSubmit={submit}/>:<p><Link to="/login" className="text-emerald-600">เข้าสู่ระบบ</Link> เพื่อรีวิว</p>}
    </section>
   </div>
  </div>
 </div>;
}
