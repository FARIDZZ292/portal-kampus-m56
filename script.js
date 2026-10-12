/**
 * KampusKita - Portal Akademik & Simulasi Audit Keamanan KSI (M5-M6)
 * Logika Frontend: Autentikasi Demo, Role-Based Access Control, Manajemen Tugas,
 * Forum Diskusi, Simulasi IDOR & Eskalasi Hak Akses, serta Log Audit.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DATA SEEDING (DATA AWAL SINTETIS)
  // ==========================================================================

  const STORAGE_KEYS = {
    ACCOUNTS: 'kampuskita_accounts',
    GRADES: 'kampuskita_grades',
    ASSIGNMENTS: 'kampuskita_assignments',
    DISCUSSIONS: 'kampuskita_discussions',
    AUDIT_LOGS: 'kampuskita_audit_logs',
    CURRENT_USER: 'kampuskita_session_user'
  };

  const DEFAULT_ACCOUNTS = [
    {
      username: 'mhs001',
      password: 'mhs123',
      name: 'Ahmad Fauzi',
      role: 'mahasiswa',
      idNumber: '202401001',
      isDefault: true
    },
    {
      username: 'mhs002',
      password: 'mhs123',
      name: 'Siti Nurhaliza',
      role: 'mahasiswa',
      idNumber: '202401002',
      isDefault: true
    },
    {
      username: 'dosen01',
      password: 'dosen123',
      name: 'Dr. Budi Santoso, M.Kom.',
      role: 'dosen',
      idNumber: '198503152010121001',
      isDefault: true
    },
    {
      username: 'admin01',
      password: 'admin123',
      name: 'Sistem Administrator Kampus',
      role: 'admin',
      idNumber: 'ADMIN-ROOT-01',
      isDefault: true
    }
  ];

  const DEFAULT_GRADES = {
    mhs001: [
      {
        code: 'KSI-301',
        name: 'Keamanan Sistem Informasi',
        sks: 3,
        lecturer: 'Dr. Budi Santoso, M.Kom.',
        tugas: 88,
        uts: 85,
        uas: 90,
        finalScore: 87.9,
        gradeLetter: 'A',
        status: 'Lulus'
      },
      {
        code: 'PWL-302',
        name: 'Pemrograman Web Lanjut',
        sks: 3,
        lecturer: 'Mira Lestari, M.T.',
        tugas: 82,
        uts: 80,
        uas: 86,
        finalScore: 83.0,
        gradeLetter: 'A-',
        status: 'Lulus'
      },
      {
        code: 'RPL-204',
        name: 'Rekayasa Perangkat Lunak',
        sks: 3,
        lecturer: 'Hendra Wijaya, Ph.D.',
        tugas: 78,
        uts: 75,
        uas: 82,
        finalScore: 78.7,
        gradeLetter: 'B+',
        status: 'Lulus'
      },
      {
        code: 'JKO-205',
        name: 'Jaringan Komputer',
        sks: 3,
        lecturer: 'Dr. Budi Santoso, M.Kom.',
        tugas: 92,
        uts: 88,
        uas: 94,
        finalScore: 91.6,
        gradeLetter: 'A',
        status: 'Lulus'
      }
    ],
    mhs002: [
      {
        code: 'KSI-301',
        name: 'Keamanan Sistem Informasi',
        sks: 3,
        lecturer: 'Dr. Budi Santoso, M.Kom.',
        tugas: 95,
        uts: 92,
        uas: 96,
        finalScore: 94.5,
        gradeLetter: 'A',
        status: 'Lulus'
      },
      {
        code: 'PWL-302',
        name: 'Pemrograman Web Lanjut',
        sks: 3,
        lecturer: 'Mira Lestari, M.T.',
        tugas: 90,
        uts: 88,
        uas: 92,
        finalScore: 90.2,
        gradeLetter: 'A',
        status: 'Lulus'
      },
      {
        code: 'RPL-204',
        name: 'Rekayasa Perangkat Lunak',
        sks: 3,
        lecturer: 'Hendra Wijaya, Ph.D.',
        tugas: 85,
        uts: 84,
        uas: 88,
        finalScore: 85.9,
        gradeLetter: 'A',
        status: 'Lulus'
      },
      {
        code: 'JKO-205',
        name: 'Jaringan Komputer',
        sks: 3,
        lecturer: 'Dr. Budi Santoso, M.Kom.',
        tugas: 89,
        uts: 86,
        uas: 90,
        finalScore: 88.5,
        gradeLetter: 'A',
        status: 'Lulus'
      }
    ]
  };

  const DEFAULT_ASSIGNMENTS = [
    {
      id: 'TGS-1001',
      studentUsername: 'mhs001',
      studentName: 'Ahmad Fauzi',
      course: 'Keamanan Sistem Informasi',
      title: 'Laporan Analisis Ancaman Web Kampus M5',
      fileName: 'laporan_ancaman_mhs001.pdf',
      fileSize: '1.4 MB',
      submittedAt: '2026-10-10 14:30:20',
      status: 'Sudah Dinilai',
      score: 88,
      feedback: 'Analisis ancaman IDOR sangat komprehensif, rekomendasi mitigasi tepat sasaran.',
      notes: 'Tugas telah dilengkapi diagram alir ancaman.'
    },
    {
      id: 'TGS-1002',
      studentUsername: 'mhs001',
      studentName: 'Ahmad Fauzi',
      course: 'Pemrograman Web Lanjut',
      title: 'Implementasi Antarmuka Responsif Portal',
      fileName: 'frontend_portal_mhs001.zip',
      fileSize: '3.8 MB',
      submittedAt: '2026-10-11 09:15:45',
      status: 'Menunggu Penilaian',
      score: null,
      feedback: '',
      notes: 'Menggunakan vanilla CSS dan semantic HTML5.'
    },
    {
      id: 'TGS-1003',
      studentUsername: 'mhs002',
      studentName: 'Siti Nurhaliza',
      course: 'Keamanan Sistem Informasi',
      title: 'Pengujian Kontrol Akses dan Otorisasi Web',
      fileName: 'uji_otorisasi_siti.pdf',
      fileSize: '2.1 MB',
      submittedAt: '2026-10-11 11:20:10',
      status: 'Menunggu Penilaian',
      score: null,
      feedback: '',
      notes: 'Laporan pengujian kerentanan eskalasi hak akses.'
    }
  ];

  const DEFAULT_DISCUSSIONS = [
    {
      id: 'DISC-01',
      senderUsername: 'dosen01',
      senderName: 'Dr. Budi Santoso, M.Kom.',
      senderRole: 'dosen',
      topic: 'Keamanan Sistem Informasi',
      content: 'Selamat siang rekan mahasiswa. Mohon perhatikan batas pengumpulan Laporan Audit M5-M6. Pastikan mencakup pengujian IDOR dan kontrol eskalasi peran.',
      timestamp: '2026-10-11 08:30:00'
    },
    {
      id: 'DISC-02',
      senderUsername: 'mhs001',
      senderName: 'Ahmad Fauzi',
      senderRole: 'mahasiswa',
      topic: 'Keamanan Sistem Informasi',
      content: 'Baik Pak Budi, terima kasih. Apakah untuk mitigasi IDOR kami perlu menyertakan contoh kode perbaikan pada sisi server?',
      timestamp: '2026-10-11 09:05:12'
    },
    {
      id: 'DISC-03',
      senderUsername: 'dosen01',
      senderName: 'Dr. Budi Santoso, M.Kom.',
      senderRole: 'dosen',
      topic: 'Keamanan Sistem Informasi',
      content: 'Ya Fauzi, sangat disarankan menyertakan contoh pemeriksaan kepemilikan objek (session vs requested id).',
      timestamp: '2026-10-11 09:20:30'
    },
    {
      id: 'DISC-04',
      senderUsername: 'admin01',
      senderName: 'Sistem Administrator Kampus',
      senderRole: 'admin',
      topic: 'Umum & Akademik',
      content: 'Pemberitahuan: Pemeliharaan rutin server kampus akan dilaksanakan pada hari Sabtu pukul 22.00 WIB.',
      timestamp: '2026-10-11 10:00:00'
    }
  ];

  const DEFAULT_AUDIT_LOGS = [
    {
      id: 'LOG-001',
      timestamp: '2026-10-12 08:00:15',
      username: 'admin01',
      role: 'admin',
      activityType: 'Inisialisasi Sistem',
      decision: 'DISETUJUI',
      reason: 'Sistem portal akademik berhasil dimuat dengan konfigurasi kontrol akses awal.'
    },
    {
      id: 'LOG-002',
      timestamp: '2026-10-12 08:15:30',
      username: 'mhs001',
      role: 'mahasiswa',
      activityType: 'Autentikasi Pengguna',
      decision: 'DISETUJUI',
      reason: 'Kredensial valid untuk akun mahasiswa terdaftar.'
    },
    {
      id: 'LOG-003',
      timestamp: '2026-10-12 08:45:10',
      username: 'dosen01',
      role: 'dosen',
      activityType: 'Penilaian Tugas Mahasiswa',
      decision: 'DISETUJUI',
      reason: 'Dosen yang berwenang memberikan nilai 88 pada tugas TGS-1001.'
    }
  ];

  // ==========================================================================
  // 2. STATE MANAGEMENT & STORAGE HELPERS
  // ==========================================================================

  function initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(DEFAULT_GRADES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DISCUSSIONS)) {
      localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(DEFAULT_DISCUSSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
    }
  }

  function getStored(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error membaca localStorage:', e);
      return null;
    }
  }

  function setStored(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error menyimpan ke localStorage:', e);
    }
  }

  function resetAllData() {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(DEFAULT_GRADES));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(DEFAULT_DISCUSSIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
    
    // Log tindakan reset
    addAuditLog('Sistem / Pengguna', 'admin', 'Reset Data Demo', 'DISETUJUI', 'Seluruh data demo dikembalikan ke setelan awal pabrik.');
  }

  // ==========================================================================
  // 3. UTILITY & SECURITY FUNCTIONS
  // ==========================================================================

  // Sanitasi string untuk mencegah Cross-Site Scripting (XSS)
  function escapeHTML(str) {
    if (typeof str !== 'string') return str == null ? '' : String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getFormattedTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-message">${escapeHTML(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  function addAuditLog(username, role, activityType, decision, reason) {
    const logs = getStored(STORAGE_KEYS.AUDIT_LOGS) || [];
    const newLog = {
      id: 'LOG-' + String(Date.now()).slice(-6),
      timestamp: getFormattedTimestamp(),
      username: username || 'Tamu / Anonim',
      role: role || 'none',
      activityType: activityType,
      decision: decision, // 'DISETUJUI' | 'DITOLAK' | 'DITAHAN' | 'PERINGATAN'
      reason: reason
    };
    logs.unshift(newLog);
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs);

    // Refresh tabel log jika sedang terbuka
    if (currentActiveView === 'audit-logs') {
      renderAuditLogsTable();
    }
    // Update counter di dashboard
    const dashTotal = document.getElementById('dashTotalLogs');
    if (dashTotal) {
      dashTotal.textContent = `${logs.length} entri`;
    }
  }

  // ==========================================================================
  // 4. AUTHENTICATION & SESSION
  // ==========================================================================

  let currentUser = null;
  let currentActiveView = 'dashboard';

  function getCurrentSession() {
    try {
      const sessionData = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (e) {
      return null;
    }
  }

  function setSessionUser(user) {
    currentUser = user;
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  function clearSession() {
    currentUser = null;
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  function handleLogin(username, password) {
    const accounts = getStored(STORAGE_KEYS.ACCOUNTS) || [];
    const user = accounts.find(
      acc => acc.username.toLowerCase() === username.trim().toLowerCase() && acc.password === password
    );

    if (user) {
      setSessionUser(user);
      addAuditLog(user.username, user.role, 'Login Pengguna', 'DISETUJUI', `Autentikasi berhasil sebagai peran ${user.role}.`);
      showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      showPortalApp();
    } else {
      addAuditLog(username, 'unknown', 'Percobaan Login Gagal', 'DITOLAK', 'Kombinasi nama pengguna atau kata sandi tidak cocok.');
      showToast('Nama pengguna atau kata sandi tidak valid!', 'error');
    }
  }

  function handleLogout() {
    if (currentUser) {
      addAuditLog(currentUser.username, currentUser.role, 'Logout Pengguna', 'DISETUJUI', 'Sesi berhasil diakhiri oleh pengguna.');
    }
    clearSession();
    showToast('Anda telah keluar dari akun.', 'info');
    showLoginView();
  }

  // ==========================================================================
  // 5. VIEW SWITCHING & ROLE-BASED ACCESS CONTROL (RBAC)
  // ==========================================================================

  function showLoginView() {
    document.getElementById('loginView').classList.remove('hidden');
    document.getElementById('portalView').classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
  }

  function showPortalApp() {
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('portalView').classList.remove('hidden');
    
    updateUserProfileDisplay();
    applyRoleBasedMenuVisibility();
    switchView('dashboard');
  }

  function updateUserProfileDisplay() {
    if (!currentUser) return;

    const initials = currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    
    // Sidebar profile
    document.getElementById('sidebarAvatar').textContent = initials;
    document.getElementById('sidebarUserName').textContent = currentUser.name;
    document.getElementById('sidebarUserRole').textContent = `Peran: ${currentUser.role}`;

    // Header profile
    document.getElementById('headerAvatar').textContent = initials;
    document.getElementById('headerUserName').textContent = currentUser.name;
    document.getElementById('headerUserRole').textContent = currentUser.role.toUpperCase();

    // Context badges on audit views
    const idorUserTag = document.getElementById('idorCurrentUserTag');
    if (idorUserTag) {
      idorUserTag.textContent = `${currentUser.username} (${currentUser.name})`;
    }
    const escRoleTag = document.getElementById('escOriginalRoleTag');
    if (escRoleTag) {
      escRoleTag.textContent = currentUser.role;
    }
  }

  function applyRoleBasedMenuVisibility() {
    if (!currentUser) return;
    const role = currentUser.role; // 'mahasiswa' | 'dosen' | 'admin'

    // Sembunyikan semua item navigasi berbasis peran terlebih dahulu
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      const isRoleMahasiswa = btn.classList.contains('role-mahasiswa');
      const isRoleDosen = btn.classList.contains('role-dosen');
      const isRoleAdmin = btn.classList.contains('role-admin');

      // Jika tombol memiliki kelas pembatas peran
      if (isRoleMahasiswa || isRoleDosen || isRoleAdmin) {
        let isAllowed = false;
        if (role === 'mahasiswa' && isRoleMahasiswa) isAllowed = true;
        if (role === 'dosen' && isRoleDosen) isAllowed = true;
        if (role === 'admin' && isRoleAdmin) isAllowed = true;

        if (isAllowed) {
          btn.classList.remove('hidden');
        } else {
          btn.classList.add('hidden');
        }
      }
    });

    // Sesuaikan judul & formulir upload pada modul tugas
    const uploadSection = document.getElementById('studentUploadContainer');
    const navTextAssign = document.getElementById('navTextAssignments');
    const assignViewTitle = document.getElementById('assignmentViewTitle');
    const assignViewSubtitle = document.getElementById('assignmentViewSubtitle');

    if (role === 'mahasiswa') {
      if (uploadSection) uploadSection.classList.remove('hidden');
      if (navTextAssign) navTextAssign.textContent = 'Tugas Saya';
      if (assignViewTitle) assignViewTitle.textContent = 'Pengumpulan Tugas Kuliah';
      if (assignViewSubtitle) assignViewSubtitle.textContent = 'Unggah berkas tugas dan pantau status serta nilai evaluasi.';
    } else if (role === 'dosen') {
      if (uploadSection) uploadSection.classList.add('hidden');
      if (navTextAssign) navTextAssign.textContent = 'Penilaian Tugas';
      if (assignViewTitle) assignViewTitle.textContent = 'Pemeriksaan & Penilaian Tugas Mahasiswa';
      if (assignViewSubtitle) assignViewSubtitle.textContent = 'Tinjau berkas yang dikumpulkan mahasiswa, unduh dokumen, dan berikan nilai evaluasi.';
    } else {
      // Admin
      if (uploadSection) uploadSection.classList.add('hidden');
      if (navTextAssign) navTextAssign.textContent = 'Daftar Pengumpulan Tugas';
    }

    updateAssignmentBadgeCounter();
  }

  function updateAssignmentBadgeCounter() {
    const badge = document.getElementById('assignmentBadgeCount');
    if (!badge || !currentUser) return;

    const assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    let count = 0;

    if (currentUser.role === 'mahasiswa') {
      // Hitung tugas mahasiswa yang belum dinilai
      count = assignments.filter(
        a => a.studentUsername === currentUser.username && a.status === 'Menunggu Penilaian'
      ).length;
    } else if (currentUser.role === 'dosen') {
      // Hitung tugas yang perlu dinilai
      count = assignments.filter(a => a.status === 'Menunggu Penilaian').length;
    }

    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }

  function switchView(viewName) {
    currentActiveView = viewName;

    // Sembunyikan semua view
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('hidden'));

    // Hilangkan status aktif pada menu nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    // Update judul breadcrumb
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');

    // Tampilkan view yang dipilih
    switch (viewName) {
      case 'dashboard':
        document.getElementById('viewDashboard').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Dashboard';
        renderDashboard();
        break;

      case 'grades':
        // Guard otorisasi frontend: hanya mahasiswa
        if (currentUser.role !== 'mahasiswa') {
          showToast('Menu KHS hanya dapat diakses oleh peran Mahasiswa.', 'warning');
          switchView('dashboard');
          return;
        }
        document.getElementById('viewGrades').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Nilai Akademik (KHS)';
        renderGradesTable();
        break;

      case 'assignments':
        document.getElementById('viewAssignments').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Tugas Kuliah';
        renderAssignmentsTable();
        break;

      case 'discussion':
        document.getElementById('viewDiscussion').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Diskusi Kelas';
        renderDiscussionsFeed();
        break;

      case 'accounts':
        if (currentUser.role !== 'admin') {
          showToast('Menu Kelola Akun hanya untuk peran Administrator.', 'error');
          switchView('dashboard');
          return;
        }
        document.getElementById('viewAccounts').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Kelola Akun Demo';
        renderAccountsTable();
        break;

      case 'security-audit':
        document.getElementById('viewSecurityAudit').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Simulasi Audit KSI';
        initAuditSimulationView();
        break;

      case 'audit-logs':
        document.getElementById('viewAuditLogs').classList.remove('hidden');
        if (breadcrumbTitle) breadcrumbTitle.textContent = 'Log Keputusan Audit';
        renderAuditLogsTable();
        break;

      default:
        document.getElementById('viewDashboard').classList.remove('hidden');
        break;
    }

    // Tutup drawer di mobile jika terbuka
    document.getElementById('portalSidebar').classList.remove('sidebar-open');
  }

  // ==========================================================================
  // 6. DASHBOARD RENDERING
  // ==========================================================================

  function renderDashboard() {
    if (!currentUser) return;
    const role = currentUser.role;

    const greeting = document.getElementById('dashGreeting');
    const subGreeting = document.getElementById('dashSubGreeting');
    const statsGrid = document.getElementById('statsGrid');
    const primaryCardTitle = document.getElementById('dashPrimaryCardTitle');
    const primaryCardBody = document.getElementById('dashPrimaryCardBody');

    greeting.textContent = `Selamat Datang, ${currentUser.name}!`;

    const allAssignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    const allLogs = getStored(STORAGE_KEYS.AUDIT_LOGS) || [];
    const allAccounts = getStored(STORAGE_KEYS.ACCOUNTS) || [];

    // Update log counter
    const dashTotal = document.getElementById('dashTotalLogs');
    if (dashTotal) dashTotal.textContent = `${allLogs.length} entri`;

    if (role === 'mahasiswa') {
      subGreeting.textContent = `NIM: ${currentUser.idNumber || '202401001'} | Program Studi Teknik Informatika (Semester 4)`;
      
      const myAssignments = allAssignments.filter(a => a.studentUsername === currentUser.username);
      const pendingCount = myAssignments.filter(a => a.status === 'Menunggu Penilaian').length;
      const gradedCount = myAssignments.filter(a => a.status === 'Sudah Dinilai').length;

      // Hitung IPK simulasi
      const gradesData = getStored(STORAGE_KEYS.GRADES) || {};
      const myGrades = gradesData[currentUser.username] || [];
      const totalSks = myGrades.reduce((sum, g) => sum + g.sks, 0);
      const avgScore = myGrades.length > 0 
        ? (myGrades.reduce((sum, g) => sum + g.finalScore, 0) / myGrades.length).toFixed(1) 
        : '0';

      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-blue">🎓</div>
          <div class="stat-content">
            <span class="stat-title">Indeks Prestasi Kumulatif</span>
            <span class="stat-value">3.75</span>
            <span class="stat-meta">Rata-rata Nilai: ${avgScore} / 100</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-green">📚</div>
          <div class="stat-content">
            <span class="stat-title">Beban SKS Semester</span>
            <span class="stat-value">${totalSks} SKS</span>
            <span class="stat-meta">4 Mata Kuliah Aktif</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-purple">📤</div>
          <div class="stat-content">
            <span class="stat-title">Tugas Diserahkan</span>
            <span class="stat-value">${myAssignments.length}</span>
            <span class="stat-meta">${gradedCount} telah dinilai</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-amber">⏳</div>
          <div class="stat-content">
            <span class="stat-title">Menunggu Penilaian</span>
            <span class="stat-value">${pendingCount}</span>
            <span class="stat-meta">Evaluasi oleh dosen</span>
          </div>
        </div>
      `;

      primaryCardTitle.textContent = 'Agenda Perkuliahan & Pengumuman Mahasiswa';
      primaryCardBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="padding:12px; background:var(--bg-surface); border-radius:var(--radius-sm); border-left:3px solid var(--primary);">
            <strong>📌 Tugas Mandiri Audit M5-M6 KSI</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
              Batas waktu: 15 Oktober 2026. Lakukan pengujian simulasi kontrol akses IDOR dan Eskalasi Hak Akses pada modul Audit Keamanan.
            </p>
          </div>
          <div style="padding:12px; background:var(--bg-surface); border-radius:var(--radius-sm); border-left:3px solid var(--success);">
            <strong>✅ Pengumuman Nilai UTS</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
              Nilai UTS Keamanan Sistem Informasi dan Rekayasa Perangkat Lunak telah dipublikasikan ke KHS masing-masing.
            </p>
          </div>
        </div>
      `;

    } else if (role === 'dosen') {
      subGreeting.textContent = `NIP: ${currentUser.idNumber || '198503152010121001'} | Fakultas Ilmu Komputer - Bidang Siber`;

      const pendingAssignments = allAssignments.filter(a => a.status === 'Menunggu Penilaian').length;
      const gradedAssignments = allAssignments.filter(a => a.status === 'Sudah Dinilai').length;

      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-amber">📝</div>
          <div class="stat-content">
            <span class="stat-title">Perlu Dinilai Segera</span>
            <span class="stat-value">${pendingAssignments}</span>
            <span class="stat-meta">Pengumpulan mahasiswa</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-green">✅</div>
          <div class="stat-content">
            <span class="stat-title">Sudah Dinilai</span>
            <span class="stat-value">${gradedAssignments}</span>
            <span class="stat-meta">Telah diberikan evaluasi</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-blue">👥</div>
          <div class="stat-content">
            <span class="stat-title">Kelas Diampu</span>
            <span class="stat-value">2 Kelas</span>
            <span class="stat-meta">KSI & Jaringan Komputer</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-purple">📊</div>
          <div class="stat-content">
            <span class="stat-title">Total Berkas Masuk</span>
            <span class="stat-value">${allAssignments.length}</span>
            <span class="stat-meta">Dokumen tugas mahasiswa</span>
          </div>
        </div>
      `;

      primaryCardTitle.textContent = 'Daftar Tugas yang Perlu Dinilai Hari Ini';
      primaryCardBody.innerHTML = `
        <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:12px;">
          Terdapat <strong>${pendingAssignments} tugas mahasiswa</strong> yang menunggu evaluasi Anda. Silakan buka menu <strong>Penilaian Tugas</strong> untuk memeriksa berkas dan memasukkan nilai 0-100.
        </p>
        <button class="btn btn-sm btn-primary" onclick="window.KampusKitaApp.navigate('assignments')">
          Buka Halaman Penilaian Tugas →
        </button>
      `;

    } else {
      // Admin
      subGreeting.textContent = `ID Administrator: ${currentUser.idNumber} | Hak Akses: Tata Kelola Sistem Penuh`;

      const studentCount = allAccounts.filter(a => a.role === 'mahasiswa').length;
      const lecturerCount = allAccounts.filter(a => a.role === 'dosen').length;

      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-purple">👥</div>
          <div class="stat-content">
            <span class="stat-title">Total Akun Sintetis</span>
            <span class="stat-value">${allAccounts.length}</span>
            <span class="stat-meta">${studentCount} Mahasiswa, ${lecturerCount} Dosen</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-blue">📜</div>
          <div class="stat-content">
            <span class="stat-title">Total Jejak Audit</span>
            <span class="stat-value">${allLogs.length}</span>
            <span class="stat-meta">Aktivitas tercatat</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-green">🛡️</div>
          <div class="stat-content">
            <span class="stat-title">Status Proteksi</span>
            <span class="stat-value">Aktif</span>
            <span class="stat-meta">Logging & Audit Siaga</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper stat-icon-amber">📂</div>
          <div class="stat-content">
            <span class="stat-title">Total Tugas di Sistem</span>
            <span class="stat-value">${allAssignments.length}</span>
            <span class="stat-meta">Data pengumpulan demo</span>
          </div>
        </div>
      `;

      primaryCardTitle.textContent = 'Pusat Kontrol Administrasi & Keamanan';
      primaryCardBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px;">
          <p style="font-size:0.875rem; color:var(--text-muted);">
            Sebagai administrator, Anda dapat mengelola akun demo sintetis baru, meninjau jejak audit kontrol akses, dan mengekspor catatan log ke berkas CSV.
          </p>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;">
            <button class="btn btn-sm btn-outline-primary" onclick="window.KampusKitaApp.navigate('accounts')">Kelola Akun Demo</button>
            <button class="btn btn-sm btn-primary" onclick="window.KampusKitaApp.navigate('audit-logs')">Buka Log Audit & Ekspor CSV</button>
          </div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // 7. MAHASISWA: KARTU HASIL STUDI (KHS) / NILAI PRIBADI
  // ==========================================================================

  function renderGradesTable() {
    if (!currentUser || currentUser.role !== 'mahasiswa') return;

    const gradesTableBody = document.getElementById('gradesTableBody');
    const ownerText = document.getElementById('gradesStudentOwnerText');
    const gpaBadge = document.getElementById('studentGpaBadge');

    const allGrades = getStored(STORAGE_KEYS.GRADES) || {};
    // Hanya ambil nilai milik akun yang sedang login! (Kontrol kepemilikan aman)
    const myGrades = allGrades[currentUser.username] || [];

    if (ownerText) {
      ownerText.textContent = `Milik: ${currentUser.name} (ID / NIM: ${currentUser.idNumber || currentUser.username})`;
    }

    if (myGrades.length === 0) {
      gradesTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center; padding:24px; color:var(--text-muted);">
            Belum ada data nilai semester untuk akun ini.
          </td>
        </tr>
      `;
      return;
    }

    let totalSks = 0;
    let totalScore = 0;

    const rows = myGrades.map(g => {
      totalSks += g.sks;
      totalScore += g.finalScore;

      return `
        <tr>
          <td><code>${escapeHTML(g.code)}</code></td>
          <td><strong>${escapeHTML(g.name)}</strong></td>
          <td>${g.sks} SKS</td>
          <td>${escapeHTML(g.lecturer)}</td>
          <td>${g.tugas}</td>
          <td>${g.uts}</td>
          <td>${g.uas}</td>
          <td><strong>${g.finalScore.toFixed(1)}</strong></td>
          <td><span class="badge ${g.finalScore >= 80 ? 'badge-success' : 'badge-warning'}">${g.gradeLetter}</span></td>
          <td><span class="badge badge-success">${g.status}</span></td>
        </tr>
      `;
    }).join('');

    gradesTableBody.innerHTML = rows;

    const avg = (totalScore / myGrades.length).toFixed(2);
    // Skala 4.0 konversi sederhana
    const gpa4 = (avg >= 85 ? 4.0 : avg >= 80 ? 3.7 : avg >= 75 ? 3.3 : 3.0).toFixed(2);

    if (gpaBadge) {
      gpaBadge.innerHTML = `
        <span>Indeks Prestasi: <strong>${gpa4}</strong></span>
        <span>Total SKS Diambil: <strong>${totalSks} SKS</strong></span>
      `;
    }
  }

  // ==========================================================================
  // 8. TUGAS KULIAH (PENGUMPULAN MAHASISWA & PENILAIAN DOSEN)
  // ==========================================================================

  function renderAssignmentsTable() {
    if (!currentUser) return;
    const role = currentUser.role;

    const tableBody = document.getElementById('assignmentTableBody');
    const filterSelect = document.getElementById('assignmentStatusFilter');
    const listCardTitle = document.getElementById('assignmentListCardTitle');

    const selectedFilter = filterSelect ? filterSelect.value : 'ALL';
    let assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];

    // Filter berdasarkan peran
    if (role === 'mahasiswa') {
      assignments = assignments.filter(a => a.studentUsername === currentUser.username);
      if (listCardTitle) listCardTitle.textContent = `Riwayat Tugas Saya (${assignments.length})`;
    } else {
      if (listCardTitle) listCardTitle.textContent = `Daftar Pengumpulan Semua Mahasiswa (${assignments.length})`;
    }

    // Filter berdasarkan status
    if (selectedFilter !== 'ALL') {
      assignments = assignments.filter(a => a.status === selectedFilter);
    }

    if (assignments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:32px; color:var(--text-muted);">
            Tidak ada data pengumpulan tugas yang sesuai.
          </td>
        </tr>
      `;
      return;
    }

    const rows = assignments.map(a => {
      const isGraded = a.status === 'Sudah Dinilai';
      const statusBadge = isGraded
        ? `<span class="badge badge-success">Sudah Dinilai</span>`
        : `<span class="badge badge-warning">Menunggu Penilaian</span>`;

      const scoreDisplay = isGraded
        ? `<strong style="color:var(--success); font-size:1.05rem;">${a.score}</strong> / 100`
        : `<span class="text-muted">-</span>`;

      // Kolom Aksi bergantung peran
      let actionButtons = `
        <button class="btn btn-sm btn-outline-secondary" onclick="window.KampusKitaApp.downloadAssignment('${a.id}')" title="Unduh demo file">
          📥 Unduh
        </button>
      `;

      if (role === 'dosen') {
        actionButtons += `
          <button class="btn btn-sm btn-primary" onclick="window.KampusKitaApp.openGradeModal('${a.id}')" style="margin-left:4px;">
            ${isGraded ? '✏️ Ubah Nilai' : '⭐ Beri Nilai'}
          </button>
        `;
      }

      return `
        <tr>
          <td><code>${escapeHTML(a.id)}</code></td>
          <td>
            <strong>${escapeHTML(a.studentName)}</strong><br>
            <small class="text-muted">(${escapeHTML(a.studentUsername)})</small>
          </td>
          <td>${escapeHTML(a.course)}</td>
          <td>
            <strong>${escapeHTML(a.title)}</strong>
            ${a.feedback ? `<div style="font-size:0.75rem; color:#065f46; background:#ecfdf5; padding:2px 6px; border-radius:4px; margin-top:4px;">💬 Feedback: ${escapeHTML(a.feedback)}</div>` : ''}
          </td>
          <td>
            <code>${escapeHTML(a.fileName)}</code><br>
            <small class="text-muted">${escapeHTML(a.fileSize || '1.0 MB')}</small>
          </td>
          <td><small class="text-muted">${escapeHTML(a.submittedAt)}</small></td>
          <td>${statusBadge}</td>
          <td>${scoreDisplay}</td>
          <td>${actionButtons}</td>
        </tr>
      `;
    }).join('');

    tableBody.innerHTML = rows;
  }

  function handleAssignmentUpload(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'mahasiswa') return;

    const course = document.getElementById('assignCourseSelect').value;
    const title = document.getElementById('assignTitleInput').value.trim();
    const fileInput = document.getElementById('assignFileInput');
    const notes = document.getElementById('assignNotesInput').value.trim();

    if (!course || !title) {
      showToast('Harap lengkapi mata kuliah dan judul tugas!', 'warning');
      return;
    }

    let fileName = 'dokumen_tugas.pdf';
    let fileSize = '1.2 MB';

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      fileName = file.name;
      fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    }

    const assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    const newAssignment = {
      id: 'TGS-' + String(Date.now()).slice(-5),
      studentUsername: currentUser.username,
      studentName: currentUser.name,
      course: course,
      title: title,
      fileName: fileName,
      fileSize: fileSize,
      submittedAt: getFormattedTimestamp(),
      status: 'Menunggu Penilaian',
      score: null,
      feedback: '',
      notes: notes
    };

    assignments.unshift(newAssignment);
    setStored(STORAGE_KEYS.ASSIGNMENTS, assignments);

    // Audit log
    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Pengumpulan Tugas Mahasiswa',
      'DISETUJUI',
      `Mahasiswa mengunggah berkas '${fileName}' untuk tugas '${title}' (${course}).`
    );

    // Reset formulir
    document.getElementById('uploadAssignmentForm').reset();
    document.getElementById('fileChosenText').textContent = 'Klik atau seret berkas ke sini (PDF, ZIP, DOCX, TXT - Maks 10MB)';

    showToast('Tugas berhasil diunggah! Menunggu evaluasi dosen.', 'success');
    updateAssignmentBadgeCounter();
    renderAssignmentsTable();
  }

  function downloadAssignmentDemo(assignmentId) {
    const assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    const task = assignments.find(a => a.id === assignmentId);
    if (!task) {
      showToast('Berkas tugas tidak ditemukan!', 'error');
      return;
    }

    // Buat file teks dummy untuk diunduh langsung di peramban
    const fileContent = `===========================================================\n` +
      `KAMPUSKITA - SISTEM INFORMASI AKADEMIK (BERKAS TUGAS SINTETIS)\n` +
      `===========================================================\n` +
      `ID Tugas      : ${task.id}\n` +
      `Mata Kuliah   : ${task.course}\n` +
      `Judul Tugas   : ${task.title}\n` +
      `Pengunggah    : ${task.studentName} (${task.studentUsername})\n` +
      `Waktu Kumpul  : ${task.submittedAt}\n` +
      `Status        : ${task.status}\n` +
      `Nilai         : ${task.score !== null ? task.score : 'Belum dinilai'}\n` +
      `Catatan Dosen : ${task.feedback || '-'}\n` +
      `Catatan Siswa : ${task.notes || '-'}\n\n` +
      `Catatan Sistem: Berkas ini adalah representasi demonstrasi sintetis untuk pengujian audit KSI M5-M6.`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = task.fileName.endsWith('.txt') ? task.fileName : `${task.fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Mengunduh berkas simulasi: ${task.fileName}`, 'info');

    // Catat log unduhan
    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Pengunduhan Berkas Tugas',
      'DISETUJUI',
      `Pengguna mengunduh berkas tugas ID ${task.id}.`
    );
  }

  function openGradeModal(assignmentId) {
    if (!currentUser || currentUser.role !== 'dosen') {
      showToast('Hanya dosen yang berwenang memberikan nilai!', 'error');
      return;
    }

    const assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    const task = assignments.find(a => a.id === assignmentId);
    if (!task) return;

    document.getElementById('gradeAssignmentId').value = task.id;
    document.getElementById('gradeModalStudent').textContent = `${task.studentName} (${task.studentUsername})`;
    document.getElementById('gradeModalCourse').textContent = task.course;
    document.getElementById('gradeModalAssignTitle').textContent = task.title;
    document.getElementById('gradeModalFileName').textContent = task.fileName;
    document.getElementById('gradeScoreInput').value = task.score !== null ? task.score : '';
    document.getElementById('gradeFeedbackInput').value = task.feedback || '';

    document.getElementById('gradeModalOverlay').classList.remove('hidden');
  }

  function closeGradeModal() {
    document.getElementById('gradeModalOverlay').classList.add('hidden');
  }

  function handleGradeSubmit(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'dosen') return;

    const assignmentId = document.getElementById('gradeAssignmentId').value;
    const scoreVal = parseInt(document.getElementById('gradeScoreInput').value, 10);
    const feedbackVal = document.getElementById('gradeFeedbackInput').value.trim();

    // Validasi nilai 0-100
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      showToast('Nilai harus berupa angka bulat antara 0 sampai 100!', 'warning');
      return;
    }

    const assignments = getStored(STORAGE_KEYS.ASSIGNMENTS) || [];
    const taskIndex = assignments.findIndex(a => a.id === assignmentId);
    if (taskIndex === -1) return;

    assignments[taskIndex].score = scoreVal;
    assignments[taskIndex].feedback = feedbackVal;
    assignments[taskIndex].status = 'Sudah Dinilai';

    setStored(STORAGE_KEYS.ASSIGNMENTS, assignments);

    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Penilaian Tugas Mahasiswa',
      'DISETUJUI',
      `Dosen memberikan nilai ${scoreVal} untuk tugas ${assignmentId} (${assignments[taskIndex].title}) milik ${assignments[taskIndex].studentUsername}.`
    );

    closeGradeModal();
    showToast(`Nilai ${scoreVal} berhasil disimpan dan dipublikasikan ke mahasiswa!`, 'success');
    updateAssignmentBadgeCounter();
    renderAssignmentsTable();
  }

  // ==========================================================================
  // 9. FORUM DISKUSI KELAS (SANITASI XSS KETAT)
  // ==========================================================================

  function renderDiscussionsFeed() {
    const feed = document.getElementById('discussionFeed');
    const filterCourse = document.getElementById('forumCourseFilter');
    const selectedCourse = filterCourse ? filterCourse.value : 'ALL';

    let messages = getStored(STORAGE_KEYS.DISCUSSIONS) || [];

    if (selectedCourse !== 'ALL') {
      messages = messages.filter(m => m.topic === selectedCourse);
    }

    if (messages.length === 0) {
      feed.innerHTML = `
        <div style="text-align:center; padding:32px; color:var(--text-muted);">
          Belum ada pesan pada kategori topik ini. Jadilah yang pertama mengirim pesan diskusi!
        </div>
      `;
      return;
    }

    feed.innerHTML = messages.map(m => {
      const isMine = currentUser && m.senderUsername === currentUser.username;
      const initials = (m.senderName || 'US').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

      let badgeRole = '<span class="badge badge-student">Mahasiswa</span>';
      if (m.senderRole === 'dosen') badgeRole = '<span class="badge badge-lecturer">Dosen</span>';
      if (m.senderRole === 'admin') badgeRole = '<span class="badge badge-admin">Admin</span>';

      return `
        <div class="chat-bubble-item ${isMine ? 'mine' : ''}">
          <div class="chat-avatar">${initials}</div>
          <div class="chat-content-box">
            <div class="chat-header">
              <span class="chat-sender-name">${escapeHTML(m.senderName)}</span>
              ${badgeRole}
              <span class="chat-topic-tag">${escapeHTML(m.topic)}</span>
              <span class="chat-timestamp">${escapeHTML(m.timestamp)}</span>
            </div>
            <div class="chat-body-text">${escapeHTML(m.content)}</div>
          </div>
        </div>
      `;
    }).join('');

    // Scroll otomatis ke bawah
    feed.scrollTop = feed.scrollHeight;
  }

  function handleSendDiscussion(e) {
    e.preventDefault();
    if (!currentUser) return;

    const topic = document.getElementById('msgCategory').value;
    const content = document.getElementById('msgContent').value.trim();

    if (!content) {
      showToast('Pesan tidak boleh kosong!', 'warning');
      return;
    }

    const messages = getStored(STORAGE_KEYS.DISCUSSIONS) || [];
    const newMsg = {
      id: 'DISC-' + String(Date.now()).slice(-5),
      senderUsername: currentUser.username,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      topic: topic,
      content: content, // Disimpan murni, akan disanitasi oleh escapeHTML() saat rendering
      timestamp: getFormattedTimestamp()
    };

    messages.push(newMsg);
    setStored(STORAGE_KEYS.DISCUSSIONS, messages);

    document.getElementById('msgContent').value = '';
    showToast('Pesan diskusi terkirim!', 'success');
    renderDiscussionsFeed();
  }

  // ==========================================================================
  // 10. ADMIN: KELOLA AKUN SINTETIS
  // ==========================================================================

  function renderAccountsTable() {
    if (!currentUser || currentUser.role !== 'admin') return;

    const accounts = getStored(STORAGE_KEYS.ACCOUNTS) || [];
    const tableBody = document.getElementById('accountsTableBody');
    const badge = document.getElementById('totalAccountsBadge');

    if (badge) badge.textContent = `${accounts.length} Akun Terdaftar`;

    tableBody.innerHTML = accounts.map(acc => {
      let roleBadge = '<span class="badge badge-student">Mahasiswa</span>';
      if (acc.role === 'dosen') roleBadge = '<span class="badge badge-lecturer">Dosen</span>';
      if (acc.role === 'admin') roleBadge = '<span class="badge badge-admin">Admin</span>';

      const isProtected = acc.isDefault;

      return `
        <tr>
          <td><code>${escapeHTML(acc.username)}</code></td>
          <td><strong>${escapeHTML(acc.name)}</strong></td>
          <td>${roleBadge}</td>
          <td>${isProtected ? '<span class="badge badge-neutral">Akun Default Demo</span>' : '<span class="badge badge-info">Akun Kustom</span>'}</td>
          <td>
            ${isProtected 
              ? '<span class="text-muted-sm" title="Akun demo bawaan dilindungi untuk pengujian">(Terkunci)</span>'
              : `<button class="btn btn-sm btn-outline-danger" onclick="window.KampusKitaApp.deleteAccount('${escapeHTML(acc.username)}')">Hapus Akun</button>`
            }
          </td>
        </tr>
      `;
    }).join('');
  }

  function handleCreateAccount(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'admin') return;

    const username = document.getElementById('newAccUsername').value.trim();
    const password = document.getElementById('newAccPassword').value;
    const name = document.getElementById('newAccName').value.trim();
    const role = document.getElementById('newAccRole').value;

    const accounts = getStored(STORAGE_KEYS.ACCOUNTS) || [];
    if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
      showToast(`Username '${username}' sudah digunakan! Gunakan username lain.`, 'error');
      return;
    }

    const newAcc = {
      username: username,
      password: password,
      name: name,
      role: role,
      idNumber: 'SYN-' + Math.floor(100000 + Math.random() * 900000),
      isDefault: false
    };

    accounts.push(newAcc);
    setStored(STORAGE_KEYS.ACCOUNTS, accounts);

    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Penambahan Akun Sintetis',
      'DISETUJUI',
      `Administrator menambahkan akun baru: ${username} dengan peran ${role}.`
    );

    document.getElementById('createAccountForm').reset();
    showToast(`Akun sintetis '${username}' (${role}) berhasil didaftarkan!`, 'success');
    renderAccountsTable();
  }

  function deleteAccount(username) {
    if (!currentUser || currentUser.role !== 'admin') return;

    const accounts = getStored(STORAGE_KEYS.ACCOUNTS) || [];
    const target = accounts.find(a => a.username === username);

    if (!target) return;
    if (target.isDefault) {
      showToast('Akun demo bawaan dilindungi dan tidak dapat dihapus!', 'warning');
      return;
    }

    if (!confirm(`Konfirmasi: Apakah Anda yakin ingin menghapus akun '${username}'?`)) {
      return;
    }

    const filtered = accounts.filter(a => a.username !== username);
    setStored(STORAGE_KEYS.ACCOUNTS, filtered);

    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Penghapusan Akun Sintetis',
      'DISETUJUI',
      `Administrator menghapus akun demo '${username}'.`
    );

    showToast(`Akun '${username}' berhasil dihapus.`, 'info');
    renderAccountsTable();
  }

  // ==========================================================================
  // 11. LABORATORIUM AUDIT KEAMANAN KSI (M5-M6)
  // ==========================================================================

  function initAuditSimulationView() {
    updateUserProfileDisplay();
  }

  /**
   * SIMULASI 1A: Risiko IDOR (Insecure Direct Object Reference)
   * Skenario: Pengguna meminta data nilai mahasiswa lain (mhs002) tanpa kontrol kepemilikan.
   */
  function simulateIdorVulnerable() {
    const requestedStudentId = 'mhs002'; // Target korban sintetis
    const requester = currentUser ? currentUser.username : 'mhs001';

    const allGrades = getStored(STORAGE_KEYS.GRADES) || {};
    const targetGrades = allGrades[requestedStudentId] || [];

    const resultBox = document.getElementById('idorResultContent');
    const resultStatus = document.getElementById('idorResultStatus');

    resultStatus.className = 'badge badge-danger';
    resultStatus.textContent = 'RENTAN (DATA BOCOR)';

    let formattedGrades = targetGrades.map(g => 
      `  • ${g.code} - ${g.name}: Nilai Akhir=${g.finalScore} (${g.gradeLetter})`
    ).join('\n');

    resultBox.textContent = 
`[PERINGATAN AUDIT: RESPON RENTAN IDOR (CWE-639)]
Endpoint: GET /api/v1/academic/grades?student_id=${requestedStudentId}
Pemohon Sesi Aktif: ${requester}
ID Objek Target: ${requestedStudentId} (Siti Nurhaliza)

HASIL EVALUASI SERVER:
  Status: HTTP 200 OK (Tidak ada validasi kepemilikan sesi terhadap ID objek!)
  Data Rahasia yang Berhasil Diekstraksi:
${formattedGrades}

DAMPAK RISIKO:
  Pengguna '${requester}' dapat melihat seluruh nilai rahasia mahasiswa '${requestedStudentId}'. 
  Penyerang dapat melakukan enumerasi sekuensial (IDOR) untuk membocorkan nilai seluruh kampus.`;

    // Catat ke audit log
    addAuditLog(
      requester,
      currentUser ? currentUser.role : 'mahasiswa',
      'Simulasi Audit IDOR: Mode Rentan',
      'DITAHAN',
      `Simulasi IDOR dieksekusi: Sesi ${requester} membaca data nilai ${requestedStudentId} karena verifikasi kepemilikan objek diabaikan.`
    );

    showToast('Simulasi IDOR Rentan selesai dievaluasi. Data berhasil bocor!', 'error');
  }

  /**
   * SIMULASI 1B: Pemeriksaan Aman IDOR
   * Skenario: Server memverifikasi kecocokan antara ID sesi login dengan ID objek yang diminta.
   */
  function simulateIdorSecure() {
    const requestedStudentId = 'mhs002';
    const requester = currentUser ? currentUser.username : 'mhs001';

    const resultBox = document.getElementById('idorResultContent');
    const resultStatus = document.getElementById('idorResultStatus');

    // Evaluasi kontrol keamanan: Apakah ID objek sama dengan user sesi?
    const isOwner = requester === requestedStudentId;

    if (!isOwner) {
      resultStatus.className = 'badge badge-success';
      resultStatus.textContent = 'AMAN (AKSES DITOLAK)';

      resultBox.textContent = 
`[KONTROL KEAMANAN AUDIT: PEMERIKSAAN OTORISASI AMAN]
Endpoint: GET /api/v1/academic/grades?student_id=${requestedStudentId}
Pemohon Sesi Aktif: ${requester}
ID Objek Target: ${requestedStudentId}

KODE PEMERIKSAAN SERVER (SERVER-SIDE AUTHORIZATION):
  if (session.user.id !== requested_object.owner_id && session.user.role !== 'admin') {
      throw new ForbiddenException("Akses Ditolak: Anda bukan pemilik sah dari data ini.");
  }

HASIL RESPON:
  Status: HTTP 403 Forbidden
  Pesan: "Pelanggaran Kontrol Akses. Mahasiswa hanya diizinkan melihat nilai miliknya sendiri."

DAMPAK POSITIF:
  Kerahasiaan (Confidentiality) data mahasiswa terlindungi dari pembacaan tidak sah.`;

      // Catat ke audit log
      addAuditLog(
        requester,
        currentUser ? currentUser.role : 'mahasiswa',
        'Simulasi Audit IDOR: Pemeriksaan Aman',
        'DITOLAK',
        `Akses tidak sah ditolak: Sesi ${requester} tidak berhak membaca data nilai milik ${requestedStudentId} (HTTP 403).`
      );

      showToast('Pemeriksaan Aman Sukses: Akses IDOR berhasil ditolak!', 'success');
    } else {
      resultStatus.className = 'badge badge-info';
      resultStatus.textContent = 'DIIZINKAN (PEMILIK SAH)';
      resultBox.textContent = `Pemohon adalah pemilik data sendiri (${requester}). Akses diizinkan secara sah.`;
    }
  }

  /**
   * SIMULASI 2A: Risiko Eskalasi Hak Akses (Privilege Escalation)
   * Skenario: Penyerang memanipulasi parameter peran (role: "admin") dari sisi klien.
   */
  function simulateEscalationVulnerable() {
    const requester = currentUser ? currentUser.username : 'mhs001';
    const originalRole = currentUser ? currentUser.role : 'mahasiswa';

    const resultBox = document.getElementById('escResultContent');
    const resultStatus = document.getElementById('escResultStatus');

    resultStatus.className = 'badge badge-danger';
    resultStatus.textContent = 'RENTAN (ESKALASI BERHASIL)';

    resultBox.textContent = 
`[PERINGATAN AUDIT: RISIKO ESKALASI HAK AKSES (CWE-269)]
Payload Klien: POST /api/v1/user/profile-update
Data Dimanipulasi: { "username": "${requester}", "role": "admin" }

EVALUASI SISTEM RENTAN:
  Sistem mempercayai atribut peran yang dikirim langsung dari peramban/klien pengguna.
  Tanpa validasi hak istimewa di server, pengguna tingkat rendah berhasil mengklaim hak akses 'ADMIN'.

DAMPAK RISIKO:
  Pengguna dapat melakukan eskalasi hak akses horizontal maupun vertikal:
  - Menghapus akun mahasiswa atau dosen lain
  - Mengubah nilai dan mengekspor seluruh basis data rahasia
  - Mengambil alih kontrol penuh atas sistem kampus.`;

    // Catat log
    addAuditLog(
      requester,
      originalRole,
      'Simulasi Eskalasi: Mode Rentan',
      'PERINGATAN',
      `Simulasi eskalasi hak akses dievaluasi: Sistem rentan jika mempercayai masukan peran dari browser klien.`
    );

    showToast('Simulasi Eskalasi Rentan selesai dievaluasi.', 'warning');
  }

  /**
   * SIMULASI 2B: Kontrol Aman Eskalasi Hak Akses
   * Skenario: Server menolak peran masukan klien dan mempertahankan peran sesi otoritatif.
   */
  function simulateEscalationSecure() {
    const requester = currentUser ? currentUser.username : 'mhs001';
    const originalRole = currentUser ? currentUser.role : 'mahasiswa';

    const resultBox = document.getElementById('escResultContent');
    const resultStatus = document.getElementById('escResultStatus');

    resultStatus.className = 'badge badge-success';
    resultStatus.textContent = 'AMAN (ESKALASI DITANGKAL)';

    resultBox.textContent = 
`[KONTROL KEAMANAN AUDIT: PENEGAKAN OTORITAS SERVER (RBAC)]
Payload Klien Dicurigai: { "username": "${requester}", "role": "admin" }

LOGIKA PENEGAKAN SERVER:
  1. Parameter 'role' pada request body diabaikan atau dibuang (Mass Assignment Protection).
  2. Peran akun diverifikasi langsung ke tabel otoritatif/sesi kriptografis di server.
  3. Upaya mengubah peran akun tanpa izin khusus Administrator dicatat sebagai anomali.

HASIL RESPON:
  Status: HTTP 403 Forbidden / Field Ignored
  Peran Terverifikasi: '${originalRole}' (Peran asli akun tetap dipertahankan).
  Tindakan Keamanan: Percobaan modifikasi wewenang dibatalkan.

DAMPAK POSITIF:
  Integritas hak akses aplikasi terjaga secara mutlak pada tingkat arsitektur.`;

    // Catat log
    addAuditLog(
      requester,
      originalRole,
      'Simulasi Eskalasi: Kontrol Aman',
      'DITOLAK',
      `Penegakan RBAC aman: Percobaan eskalasi peran dari '${originalRole}' ke 'admin' berhasil ditolak dan dicatat.`
    );

    showToast('Kontrol Aman Sukses: Upaya eskalasi hak akses ditangkal!', 'success');
  }

  // ==========================================================================
  // 12. LOG KEPUTUSAN AUDIT & EKSPOR CSV
  // ==========================================================================

  function renderAuditLogsTable() {
    const tableBody = document.getElementById('auditLogsTableBody');
    const filterSelect = document.getElementById('logFilterDecision');
    const counterText = document.getElementById('logCounterText');

    const selectedFilter = filterSelect ? filterSelect.value : 'ALL';
    let logs = getStored(STORAGE_KEYS.AUDIT_LOGS) || [];

    if (selectedFilter !== 'ALL') {
      logs = logs.filter(l => l.decision === selectedFilter);
    }

    if (counterText) {
      counterText.textContent = `Menampilkan ${logs.length} entri jejak log audit`;
    }

    if (logs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">
            Tidak ada catatan log aktivitas yang cocok dengan filter.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = logs.map(l => {
      let decisionBadge = '<span class="badge badge-success">DISETUJUI</span>';
      if (l.decision === 'DITOLAK') decisionBadge = '<span class="badge badge-danger">DITOLAK</span>';
      if (l.decision === 'DITAHAN') decisionBadge = '<span class="badge badge-warning">DITAHAN</span>';
      if (l.decision === 'PERINGATAN') decisionBadge = '<span class="badge badge-danger">PERINGATAN</span>';

      return `
        <tr>
          <td><small><code>${escapeHTML(l.timestamp)}</code></small></td>
          <td><strong>${escapeHTML(l.username)}</strong></td>
          <td><span class="badge badge-neutral">${escapeHTML(l.role)}</span></td>
          <td>${escapeHTML(l.activityType)}</td>
          <td>${decisionBadge}</td>
          <td><span style="font-size:0.83rem;">${escapeHTML(l.reason)}</span></td>
        </tr>
      `;
    }).join('');
  }

  function exportAuditLogsCsv() {
    const logs = getStored(STORAGE_KEYS.AUDIT_LOGS) || [];
    if (logs.length === 0) {
      showToast('Tidak ada data log untuk diekspor!', 'warning');
      return;
    }

    // Header CSV
    const headers = ['ID Log', 'Waktu Aktivitas', 'Pengguna', 'Peran', 'Jenis Aktivitas', 'Keputusan', 'Alasan Kontrol'];
    
    // Baris data dengan escape karakter khusus
    const csvRows = [headers.join(',')];

    logs.forEach(l => {
      const row = [
        `"${l.id || ''}"`,
        `"${l.timestamp || ''}"`,
        `"${l.username || ''}"`,
        `"${l.role || ''}"`,
        `"${(l.activityType || '').replace(/"/g, '""')}"`,
        `"${l.decision || ''}"`,
        `"${(l.reason || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n'); // Tambah BOM untuk kompatibilitas Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `log_audit_kampuskita_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Catat tindakan ekspor
    addAuditLog(
      currentUser ? currentUser.username : 'admin01',
      currentUser ? currentUser.role : 'admin',
      'Ekspor Log Audit CSV',
      'DISETUJUI',
      `Pengguna mengekspor ${logs.length} catatan log audit ke format CSV.`
    );

    showToast('Log audit berhasil diekspor ke berkas CSV!', 'success');
  }

  function clearAuditLogs() {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Hanya administrator yang dapat membersihkan riwayat log!', 'error');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin mengosongkan riwayat log audit saat ini?')) {
      return;
    }

    setStored(STORAGE_KEYS.AUDIT_LOGS, []);
    addAuditLog(
      currentUser.username,
      currentUser.role,
      'Pembersihan Riwayat Log',
      'DISETUJUI',
      'Administrator mengosongkan log audit sebelumnya dan memulai sesi pencatatan baru.'
    );

    showToast('Riwayat log berhasil dibersihkan.', 'info');
    renderAuditLogsTable();
  }

  // ==========================================================================
  // 13. EVENT LISTENERS & INITIALIZATION
  // ==========================================================================

  function bindEvents() {
    // Banner penutup
    const btnCloseBanner = document.getElementById('btnCloseBanner');
    if (btnCloseBanner) {
      btnCloseBanner.addEventListener('click', () => {
        document.getElementById('eduBanner').style.display = 'none';
      });
    }

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value;
        const p = document.getElementById('loginPassword').value;
        handleLogin(u, p);
      });
    }

    // Kartu Demo Click to autofill
    document.querySelectorAll('.demo-card').forEach(card => {
      card.addEventListener('click', () => {
        const u = card.getAttribute('data-user');
        const p = card.getAttribute('data-pass');
        document.getElementById('loginUsername').value = u;
        document.getElementById('loginPassword').value = p;
        showToast(`Kredensial demo (${u}) diisikan otomatis. Klik Masuk!`, 'info');
      });
    });

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', handleLogout);
    }

    // Sidebar Nav Item Click
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-view');
        switchView(targetView);
      });
    });

    // Mobile Sidebar Open/Close
    const btnOpenSidebar = document.getElementById('btnSidebarOpen');
    const btnCloseSidebar = document.getElementById('btnSidebarClose');
    const sidebar = document.getElementById('portalSidebar');

    if (btnOpenSidebar && sidebar) {
      btnOpenSidebar.addEventListener('click', () => {
        sidebar.classList.add('sidebar-open');
      });
    }
    if (btnCloseSidebar && sidebar) {
      btnCloseSidebar.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
      });
    }

    // CTA Quick Audit on Dashboard
    const btnGoAudit = document.getElementById('btnGoAudit');
    if (btnGoAudit) {
      btnGoAudit.addEventListener('click', () => switchView('security-audit'));
    }

    // Reset Data Demo Button & Modal
    const btnResetDemoData = document.getElementById('btnResetDemoData');
    const resetModal = document.getElementById('resetConfirmModalOverlay');
    const btnResetCancel = document.getElementById('btnResetModalCancel');
    const btnResetClose = document.getElementById('btnResetModalClose');
    const btnResetConfirm = document.getElementById('btnResetModalConfirm');

    if (btnResetDemoData && resetModal) {
      btnResetDemoData.addEventListener('click', () => {
        resetModal.classList.remove('hidden');
      });
      const hideReset = () => resetModal.classList.add('hidden');
      if (btnResetCancel) btnResetCancel.addEventListener('click', hideReset);
      if (btnResetClose) btnResetClose.addEventListener('click', hideReset);

      if (btnResetConfirm) {
        btnResetConfirm.addEventListener('click', () => {
          resetAllData();
          hideReset();
          showToast('Data demo berhasil diatur ulang ke kondisi awal!', 'success');
          // Refresh view aktif saat ini
          if (currentUser) {
            updateUserProfileDisplay();
            switchView(currentActiveView);
          }
        });
      }
    }

    // Assignment Upload Form
    const uploadForm = document.getElementById('uploadAssignmentForm');
    if (uploadForm) {
      uploadForm.addEventListener('submit', handleAssignmentUpload);
    }

    // File Input Dropzone feedback text
    const fileInput = document.getElementById('assignFileInput');
    const fileChosenText = document.getElementById('fileChosenText');
    if (fileInput && fileChosenText) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          fileChosenText.textContent = `Berkas dipilih: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024).toFixed(1)} KB)`;
        } else {
          fileChosenText.textContent = 'Klik atau seret berkas ke sini (PDF, ZIP, DOCX, TXT - Maks 10MB)';
        }
      });
    }

    // Filter status tugas
    const assignFilter = document.getElementById('assignmentStatusFilter');
    if (assignFilter) {
      assignFilter.addEventListener('change', renderAssignmentsTable);
    }

    // Grade Modal Events
    const gradeForm = document.getElementById('gradeForm');
    const btnGradeClose = document.getElementById('btnGradeModalClose');
    const btnGradeCancel = document.getElementById('btnGradeModalCancel');

    if (gradeForm) gradeForm.addEventListener('submit', handleGradeSubmit);
    if (btnGradeClose) btnGradeClose.addEventListener('click', closeGradeModal);
    if (btnGradeCancel) btnGradeCancel.addEventListener('click', closeGradeModal);

    // Discussion Form & Filter
    const discForm = document.getElementById('discussionForm');
    const discFilter = document.getElementById('forumCourseFilter');

    if (discForm) discForm.addEventListener('submit', handleSendDiscussion);
    if (discFilter) discFilter.addEventListener('change', renderDiscussionsFeed);

    // Create Account Form (Admin)
    const createAccForm = document.getElementById('createAccountForm');
    if (createAccForm) createAccForm.addEventListener('submit', handleCreateAccount);

    // Security Audit Simulation Buttons
    const btnIdorVuln = document.getElementById('btnSimulateIdorVulnerable');
    const btnIdorSec = document.getElementById('btnSimulateIdorSecure');
    const btnEscVuln = document.getElementById('btnSimulateEscalationVulnerable');
    const btnEscSec = document.getElementById('btnSimulateEscalationSecure');

    if (btnIdorVuln) btnIdorVuln.addEventListener('click', simulateIdorVulnerable);
    if (btnIdorSec) btnIdorSec.addEventListener('click', simulateIdorSecure);
    if (btnEscVuln) btnEscVuln.addEventListener('click', simulateEscalationVulnerable);
    if (btnEscSec) btnEscSec.addEventListener('click', simulateEscalationSecure);

    // Audit Logs Filter, Export & Clear
    const logFilter = document.getElementById('logFilterDecision');
    const btnExportLogs = document.getElementById('btnExportLogsCsv');
    const btnClearLogs = document.getElementById('btnClearAuditLogs');

    if (logFilter) logFilter.addEventListener('change', renderAuditLogsTable);
    if (btnExportLogs) btnExportLogs.addEventListener('click', exportAuditLogsCsv);
    if (btnClearLogs) btnClearLogs.addEventListener('click', clearAuditLogs);
  }

  // Global helper namespace untuk event onclick inline di HTML tabel dinamis
  window.KampusKitaApp = {
    navigate: (view) => switchView(view),
    downloadAssignment: (id) => downloadAssignmentDemo(id),
    openGradeModal: (id) => openGradeModal(id),
    deleteAccount: (u) => deleteAccount(u)
  };

  // Entry point saat DOM selesai dimuat
  document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    bindEvents();

    const existingSession = getCurrentSession();
    if (existingSession) {
      currentUser = existingSession;
      showPortalApp();
    } else {
      showLoginView();
    }
  });

})();
