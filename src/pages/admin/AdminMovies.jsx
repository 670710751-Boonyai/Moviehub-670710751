import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getMovies, deleteAdminMovie } from '../../api/backend';
export default function AdminMovies() {
 const {token}=useAuth();const [movies,setMovies]=useState([]),[error,setError]=useState('');
 const refresh=()=>getMovies().then(setMovies).catch(e=>setError(e.message));
 useEffect(()=>{refresh()},[]);
 async function remove(movie){if(!window.confirm('ลบ '+movie.title+'?'))return;try{await deleteAdminMovie(movie.id,token);refresh()}catch(e){setError(e.message)}}
 return <section><h2 className="text-xl font-semibold">จัดการหนัง</h2>{error&&<p role="alert" className="text-red-600">{error}</p>}<div className="mt-4 space-y-2">{movies.map(movie=><div key={movie.id} className="flex items-center justify-between gap-4 rounded-lg border p-3"><span>{movie.title}</span><button onClick={()=>remove(movie)} className="text-red-600">ลบ</button></div>)}</div></section>;
}
