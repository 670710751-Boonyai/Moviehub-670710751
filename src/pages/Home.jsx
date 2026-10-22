import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../api/backend';
import { useAuth } from '../auth/AuthContext';
import FeaturedCarousel from '../components/FeaturedCarousel';

const FEATURED_LIMIT = 12;

const FEATURES = [
  {
    icon: '🎬',
    title: 'ค้นหาหนังที่ชอบ',
    description: 'เลือกดูภาพยนตร์ ค้นหาชื่อเรื่อง และกรองตามแนวหนังได้ในหน้าเดียว',
  },
  {
    icon: '⭐',
    title: 'ให้คะแนนและเขียนรีวิว',
    description: 'เข้าสู่ระบบเพื่อแบ่งปันความคิดเห็นและให้คะแนนหนังที่ดูแล้ว',
  },
  {
    icon: '💚',
    title: 'บันทึกเรื่องที่อยากดู',
    description: 'เพิ่มหนังลงใน Wishlist ส่วนตัว แล้วกลับมาดูรายการของคุณได้ทุกเมื่อ',
  },
];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [movies, setMovies] = useState([]);
  const [picks, setPicks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError('');

    getMovies()
      .then((list) => {
        if (!Array.isArray(list)) throw new Error('ข้อมูลหนังมีรูปแบบไม่ถูกต้อง');
        if (!active) return;
        setMovies(list);
        setPicks(shuffle(list).slice(0, FEATURED_LIMIT));
        setStatus('success');
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'ไม่สามารถโหลดข้อมูลหนังได้');
        setStatus('error');
      });

    return () => { active = false; };
  }, [reloadKey]);

  function refreshRecommendations() {
    setPicks(shuffle(movies).slice(0, FEATURED_LIMIT));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-teal-100 px-6 py-12 shadow-sm md:mt-10 md:px-12 md:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
            MOVIEHUB · MOVIES, REVIEWS & WISHLIST
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
            หนังน่าดู รวมไว้ที่เดียว
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            ค้นพบภาพยนตร์ เลือกดูรายละเอียด ให้คะแนน เขียนรีวิว
            และเก็บเรื่องโปรดไว้ในรายการอยากดูของคุณ
            ข้อมูลหนังเชื่อมต่อกับ MovieHub Go API
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/movies" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
              สำรวจหนังทั้งหมด →
            </Link>
            <Link to={isLoggedIn ? '/me/wishlist' : '/register'} className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
              {isLoggedIn ? 'รายการอยากดูของฉัน' : 'เริ่มต้นสมัครสมาชิก'}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600" aria-live="polite">
            <span className="font-medium text-emerald-800">
              {status === 'success'
                ? `🎞️ ${movies.length.toLocaleString('en-US')} เรื่องในคลังหนัง`
                : status === 'loading'
                  ? '🎞️ กำลังโหลดคลังหนัง...'
                  : '🎞️ ข้อมูลหนังยังไม่พร้อม'}
            </span>
            <span>รีวิว · ให้คะแนน · Wishlist</span>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="featured-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="featured-title" className="text-2xl font-semibold text-slate-900">หนังแนะนำสำหรับคุณ</h2>
            <p className="mt-1 text-sm text-slate-500">
              สุ่มจากภาพยนตร์ใน MovieHub Go API ไม่ใช่ข้อมูลตัวอย่างจาก data.js
            </p>
          </div>
          {status === 'success' && movies.length > 0 && (
            <button type="button" onClick={refreshRecommendations} className="rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50">
              ↻ สุ่มใหม่
            </button>
          )}
        </div>
        {status === 'loading' && <p role="status" className="rounded-xl border border-emerald-100 bg-white p-10 text-center text-slate-500">กำลังโหลดหนังแนะนำ...</p>}
        {status === 'error' && (
          <div role="alert" className="rounded-xl border border-rose-100 bg-white p-6">
            <p className="text-sm text-rose-700">โหลดหนังแนะนำไม่สำเร็จ: {error}</p>
            <button type="button" onClick={() => setReloadKey(n => n + 1)} className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">ลองอีกครั้ง</button>
          </div>
        )}
        {status === 'success' && <FeaturedCarousel movies={picks} />}
      </section>

      <section className="mt-14" aria-labelledby="features-title">
        <div className="mb-5">
          <h2 id="features-title" className="text-2xl font-semibold text-slate-900">ทำอะไรได้บ้างใน MovieHub?</h2>
          <p className="mt-1 text-sm text-slate-500">ฟีเจอร์ที่พร้อมให้สมาชิกใช้งานบนเว็บไซต์</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map(feature => (
            <article key={feature.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <span className="text-2xl" aria-hidden="true">{feature.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
