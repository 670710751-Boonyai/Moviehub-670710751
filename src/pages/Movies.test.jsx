import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Movies from './Movies';
import { getMovies } from '../api/backend';

// แทนทั้งไฟล์ backend.js ด้วยของปลอม: ทุกฟังก์ชันกลายเป็น jest.fn() ที่เรากำหนดคำตอบได้
jest.mock('../api/backend');

const FAKE_MOVIES = [
  { id: 1, title: 'Parasite', titleTh: 'ชนชั้นปรสิต', genre: 'Thriller', year: 2019, rating: 8.5, poster: null },
  { id: 2, title: 'Your Name', titleTh: 'หลับตาฝัน ถึงชื่อเธอ', genre: 'Animation', year: 2016, rating: 8.4, poster: null },
  { id: 3, title: 'Parasite 2', titleTh: null, genre: 'Thriller', year: 2026, rating: null, poster: null },
];

function renderMovies() {
  return render(<MemoryRouter><Movies /></MemoryRouter>);   // มี Link ข้างใน ต้องมี Router ครอบ
}

test('โหลดสำเร็จ ต้องเห็นการ์ดครบและปุ่มแนวหนังที่สร้างจากข้อมูล', async () => {
  getMovies.mockResolvedValue(FAKE_MOVIES);
  renderMovies();

  expect(await screen.findByText('Parasite')).toBeInTheDocument();   // findBy = รอจน useEffect โหลดเสร็จ
  expect(screen.getAllByRole('link')).toHaveLength(3);
  expect(screen.getByRole('button', { name: 'Thriller' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Animation' })).toBeInTheDocument();
});


    <body>
      <div>
        <div
          class="mx-auto max-w-5xl px-4 py-10 md:px-6"
        >
          <div
            class="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <h1
                class="text-2xl font-semibold text-slate-900"
              >
                หนังทั้งหมด
              </h1>
              <p
                class="text-sm text-slate-500"
              >
                แหล่งข้อมูล: TMDB (โหลดวันละครั้ง) 
              </p>
            </div>
            <input
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 md:w-72"
              placeholder="พิมพ์ชื่อหนังเพื่อกรอง..."
              value=""
            />
          </div>
          <div
            class="mb-6 flex flex-wrap gap-2"
          >
            <button
              class="rounded-full border px-3 py-1 text-sm transition border-emerald-500 bg-emerald-500 text-white"
            >
              ทุกแนว
            </button>
          </div>
          <div
            class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
            <div
              class="animate-pulse overflow-hidden rounded-xl border border-emerald-100 bg-white"
            >
              <div
                class="aspect-[2/3] bg-slate-100"
              />
              <div
                class="space-y-2 p-3"
              >
                <div
                  class="h-4 w-3/4 rounded bg-slate-100"
                />
                <div
                  class="h-3 w-1/2 rounded bg-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>