import './style.css';

// 1. PRIMITIVE TYPES (string, number, boolean) & ENVIRONMENT VARIABLES
const appName: string = import.meta.env.VITE_APP_NAME || 'Daftar Tugas Kuliah';
const appVersion: string = import.meta.env.VITE_APP_VERSION || '1.0.0';
let editingTaskId: number | null = null;
let isInitialLoaded: boolean = false;

// 2. TYPE ALIAS & UNION TYPE
type TaskStatus = 'Belum Selesai' | 'Selesai';
type TaskPriority = 'Rendah' | 'Sedang' | 'Tinggi';

// 3. INTERFACE
interface CollegeTask {
  id: number;
  title: string;
  course: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  isCompleted: boolean;
}

// 4. GENERICS SEDERHANA (untuk menyimpan & mengambil data dari LocalStorage)
class StorageRepository<T> {
  private storageKey: string;

  constructor(key: string) {
    this.storageKey = key;
  }

  getAll(): T[] {
    const rawData = localStorage.getItem(this.storageKey);
    return rawData ? (JSON.parse(rawData) as T[]) : [];
  }

  saveAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}

// Inisialisasi repository menggunakan Generic
const taskRepo = new StorageRepository<CollegeTask>('paw_college_tasks_v1');

// 5. ARRAY
let tasks: CollegeTask[] = taskRepo.getAll();

// Data awal contoh jika penyimpanan masih kosong
if (tasks.length === 0 && !isInitialLoaded) {
  tasks = [
    {
      id: 1,
      title: 'Tugas Pertemuan 6 - Aplikasi TypeScript & Vite',
      course: 'Pengembangan Aplikasi Web',
      deadline: '2026-11-30',
      priority: 'Tinggi',
      status: 'Belum Selesai',
      isCompleted: false,
    },
  ];
  taskRepo.saveAll(tasks);
  isInitialLoaded = true;
}

// Render struktur utama halaman
const appContainer = document.querySelector<HTMLDivElement>('#app')!;

appContainer.innerHTML = `
  <div class="container">
    <header>
      <div>
        <h1>${appName}</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          Manajemen Tugas Perkuliahan Berbasis TypeScript & Vite
        </p>
      </div>
      <span class="badge-version">v${appVersion}</span>
    </header>

    <section class="card">
      <h2 id="form-heading" style="margin-bottom: 1rem; font-size: 1.15rem;">Tambah Tugas Baru</h2>
      <form id="task-form" class="form-grid">
        <div class="form-group full">
          <label for="title">Nama Tugas</label>
          <input type="text" id="title" placeholder="Contoh: Laporan Praktikum Basis Data" required />
        </div>
        <div class="form-group">
          <label for="course">Mata Kuliah</label>
          <input type="text" id="course" placeholder="Contoh: Pengembangan Aplikasi Web" required />
        </div>
        <div class="form-group">
          <label for="deadline">Tenggat Waktu (Deadline)</label>
          <input type="date" id="deadline" required />
        </div>
        <div class="form-group">
          <label for="priority">Prioritas</label>
          <select id="priority">
            <option value="Rendah">Rendah</option>
            <option value="Sedang" selected>Sedang</option>
            <option value="Tinggi">Tinggi</option>
          </select>
        </div>
        <div class="form-group" style="justify-content: flex-end;">
          <div class="btn-group">
            <button type="submit" id="submit-btn" class="btn-primary">Simpan Tugas</button>
            <button type="button" id="cancel-btn" class="btn-secondary" style="display: none;">Batal</button>
          </div>
        </div>
      </form>
    </section>

    <section class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
        <h2 style="font-size: 1.15rem;">Daftar Tugas Kuliah</h2>
        <div class="stats" id="task-stats"></div>
      </div>
      <div class="task-list" id="task-list"></div>
    </section>

    <section class="card">
      <h2 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Dokumentasi Teknis Pengembangan</h2>
      <p style="font-size: 0.88rem; color: var(--text-muted);">
        Ringkasan teknologi dan alur kerja yang diterapkan dalam pengembangan aplikasi ini:
      </p>
      <div class="docs-grid">
        <div class="doc-box">
          <h3>Git & GitHub</h3>
          <p>Digunakan sebagai Version Control System untuk mencatat riwayat perubahan kode (commit), mengelola fitur secara terpisah lewat branch, simulasi penyelesaian merge conflict, serta kolaborasi melalui Pull Request.</p>
        </div>
        <div class="doc-box">
          <h3>npm (Node Package Manager)</h3>
          <p>Mengelola dependensi pustaka dan menjalankan skrip pengembangan maupun produksi (dev, build, preview) yang terdaftar di dalam berkas package.json.</p>
        </div>
        <div class="doc-box">
          <h3>TypeScript</h3>
          <p>Memberikan static typing (primitive types, array, interface, type alias, union type, dan generics) guna mencegah kesalahan tipe data sebelum kode dijalankan di browser.</p>
        </div>
        <div class="doc-box">
          <h3>Vite</h3>
          <p>Build tool modern yang menyediakan development server super cepat berbasis native ES Modules dan mengoptimalkan aset aplikasi saat proses build produksi.</p>
        </div>
        <div class="doc-box">
          <h3>Environment Variables (.env)</h3>
          <p>Menyimpan konfigurasi aplikasi seperti nama dan versi secara terpisah dari kode sumber. File .env dikecualikan melalui .gitignore, sedangkan .env.example menjadi templat publik.</p>
        </div>
        <div class="doc-box">
          <h3>Compiler, Transpiler & Bundler</h3>
          <p>TypeScript berperan sebagai transpiler yang mengubah kode .ts menjadi JavaScript standar agar dipahami browser, sedangkan bundler Vite menggabungkan dan meminifikasi seluruh modul menjadi berkas statis siap deploy.</p>
        </div>
      </div>
    </section>
  </div>
`;

// Referensi elemen DOM
const form = document.querySelector<HTMLFormElement>('#task-form')!;
const formHeading = document.querySelector<HTMLHeadingElement>('#form-heading')!;
const titleInput = document.querySelector<HTMLInputElement>('#title')!;
const courseInput = document.querySelector<HTMLInputElement>('#course')!;
const deadlineInput = document.querySelector<HTMLInputElement>('#deadline')!;
const prioritySelect = document.querySelector<HTMLSelectElement>('#priority')!;
const submitBtn = document.querySelector<HTMLButtonElement>('#submit-btn')!;
const cancelBtn = document.querySelector<HTMLButtonElement>('#cancel-btn')!;
const taskListEl = document.querySelector<HTMLDivElement>('#task-list')!;
const taskStatsEl = document.querySelector<HTMLDivElement>('#task-stats')!;

function renderTasks(): void {
  const total: number = tasks.length;
  const completedCount: number = tasks.filter((t) => t.isCompleted).length;
  taskStatsEl.innerHTML = `<span>Total: <strong>${total}</strong></span> | <span>Selesai: <strong>${completedCount}</strong></span>`;

  if (tasks.length === 0) {
    taskListEl.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1rem;">Belum ada tugas kuliah. Silakan tambahkan tugas baru di atas.</p>`;
    return;
  }

  taskListEl.innerHTML = tasks
    .map(
      (task) => `
      <div class="task-item ${task.isCompleted ? 'done' : ''}">
        <div>
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <span>📚 ${task.course}</span>
            <span>📅 ${task.deadline}</span>
            <span>⚡ Prioritas: ${task.priority}</span>
            <span class="status-pill ${task.isCompleted ? 'status-completed' : 'status-pending'}">
              ${task.status}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <button class="btn-sm btn-status" data-action="toggle" data-id="${task.id}">
            ${task.isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
          </button>
          <button class="btn-sm btn-edit" data-action="edit" data-id="${task.id}">Edit</button>
          <button class="btn-sm btn-delete" data-action="delete" data-id="${task.id}">Hapus</button>
        </div>
      </div>
    `
    )
    .join('');
}

function resetForm(): void {
  editingTaskId = null;
  form.reset();
  formHeading.textContent = 'Tambah Tugas Baru';
  submitBtn.textContent = 'Simpan Tugas';
  cancelBtn.style.display = 'none';
}

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const title: string = titleInput.value.trim();
  const course: string = courseInput.value.trim();
  const deadline: string = deadlineInput.value;
  const priority = prioritySelect.value as TaskPriority;

  if (!title || !course || !deadline) return;

  if (editingTaskId !== null) {
    tasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...task, title, course, deadline, priority } : task
    );
  } else {
    const newTask: CollegeTask = {
      id: Date.now(),
      title,
      course,
      deadline,
      priority,
      status: 'Belum Selesai',
      isCompleted: false,
    };
    tasks.push(newTask);
  }

  taskRepo.saveAll(tasks);
  resetForm();
  renderTasks();
});

cancelBtn.addEventListener('click', () => {
  resetForm();
});

taskListEl.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action || !id) return;

  if (action === 'toggle') {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        const nextCompleted: boolean = !task.isCompleted;
        const nextStatus: TaskStatus = nextCompleted ? 'Selesai' : 'Belum Selesai';
        return { ...task, isCompleted: nextCompleted, status: nextStatus };
      }
      return task;
    });
    taskRepo.saveAll(tasks);
    renderTasks();
  } else if (action === 'edit') {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (!taskToEdit) return;

    editingTaskId = taskToEdit.id;
    titleInput.value = taskToEdit.title;
    courseInput.value = taskToEdit.course;
    deadlineInput.value = taskToEdit.deadline;
    prioritySelect.value = taskToEdit.priority;

    formHeading.textContent = 'Edit Tugas Kuliah';
    submitBtn.textContent = 'Perbarui Tugas';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (action === 'delete') {
    tasks = tasks.filter((task) => task.id !== id);
    taskRepo.saveAll(tasks);
    if (editingTaskId === id) resetForm();
    renderTasks();
  }
});

// Render awal saat halaman dibuka
renderTasks();