export const btnPrimary='rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50';
export const btnGhost='rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50';
export const btnDanger='rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50';
export const inputClass='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100';
export function Loading({text='กำลังโหลด...'}){return <p className="py-12 text-center text-slate-500">{text}</p>;}
export function ErrorBox({error,onRetry}){return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
 <p className="font-medium text-red-700">โหลดข้อมูลไม่สำเร็จ</p>
 <p className="mt-1 text-sm text-red-600">{error?.message||String(error||'โปรดลองใหม่')}</p>
 {onRetry&&<button type="button" className={btnGhost+' mt-4'} onClick={onRetry}>ลองใหม่</button>}
 </div>;}
export function ConfirmBox({open,title,children,confirmText='ยืนยัน',busy=false,onConfirm,onCancel}){
 if(!open)return null;
 return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4" role="presentation">
 <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
 <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
 <div className="mt-2 text-sm text-slate-600">{children}</div>
 <div className="mt-6 flex justify-end gap-2">
 <button type="button" disabled={busy} className={btnGhost} onClick={onCancel}>ยกเลิก</button>
 <button type="button" disabled={busy} className={btnDanger} onClick={onConfirm}>{busy?'กำลังทำ...':confirmText}</button>
 </div></div></div>;
}
