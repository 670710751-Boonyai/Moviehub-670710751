import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// โครงเดียวกับหน้า Login ต่างกันแค่ช่องกรอกและฟังก์ชันที่เรียก
function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // เช็กยืนยันรหัสผ่านก่อนส่งไป Server
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setStatus('submitting');
    setError(null);
    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message);
      setStatus('typing');
    }
  }

  const input = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none';

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">สมัครสมาชิก</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="ชื่อที่แสดง"
          required
          className={input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          required
          className={input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน (4 ตัวขึ้นไป)"
          required
          className={input}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="ยืนยันรหัสผ่าน"
          required
          className={input}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {status === 'submitting' ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <p className="mt-6 text-sm text-slate-500">
        มีบัญชีแล้ว? <Link to="/login" className="text-emerald-600 hover:underline">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}

export default Register;