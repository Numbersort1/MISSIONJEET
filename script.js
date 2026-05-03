// ============================================================
//  MISSION JEET — app.js
//  Firebase Firestore + Auth (Google only)
//  All data stored in Firebase. No user-facing delete operations.
//  Notifications: only errors shown for cloud ops.
// ============================================================

// ── FIREBASE CONFIG ──────────────────────────────────────────
// Replace these values with your own Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyB2QPlcQYURBZRURX5pswoYXQ7r8cCoDdY",
    authDomain: "manifestation-55647.firebaseapp.com",
    projectId: "manifestation-55647",
    storageBucket: "manifestation-55647.firebasestorage.app",
    messagingSenderId: "841602297177",
    appId: "1:841602297177:web:0196146d94ed7ae96a7048",
    measurementId: "G-RHN7KCVYEE"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ── STATE ────────────────────────────────────────────────────
let currentUser = null;
let tasks = [];
let tests = [];
let profile = {};
let dailyHistory = {};
let chartInstances = {};
let currentMarkTestId = null;
let currentEditTestId = null;

// ── PARTICLES ────────────────────────────────────────────────
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = (-Math.random() * 20) + 's';
        p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
        container.appendChild(p);
    }
}

// ── AUTH ─────────────────────────────────────────────────────
function signInWithGoogle() {
    document.getElementById('authLoading').classList.remove('hidden');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
        document.getElementById('authLoading').classList.add('hidden');
        showToast('❌ Sign-in failed: ' + err.message, 'error');
    });
}

function signOutUser() {
    auth.signOut().catch(err => showToast('❌ Sign-out error: ' + err.message, 'error'));
}

auth.onAuthStateChanged(user => {
    if (user) {
        currentUser = user;
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('appContainer').classList.remove('hidden');
        document.getElementById('authLoading').classList.add('hidden');
        initApp();
    } else {
        currentUser = null;
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('appContainer').classList.add('hidden');
    }
});

// ── INIT ─────────────────────────────────────────────────────
function initApp() {
    updateDate();
    setInterval(updateDate, 60000);
    loadProfile();
    loadTasks();
    loadTests();
    loadDailyHistory();
    refreshQuote();
}

function updateDate() {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('pageDate').textContent = now.toLocaleDateString('en-IN', opts);
}

// ── FIRESTORE HELPERS ────────────────────────────────────────
function userDoc(col) {
    return db.collection('users').doc(currentUser.uid).collection(col);
}
function userRoot() {
    return db.collection('users').doc(currentUser.uid);
}

// ── PROFILE ──────────────────────────────────────────────────
function loadProfile() {
    userRoot().get().then(doc => {
        profile = doc.exists ? doc.data() : {};
        applyProfile();
    }).catch(err => showToast('❌ Could not load profile: ' + err.message, 'error'));
}

function applyProfile() {
    const name = profile.displayName || currentUser.displayName || 'Student';
    const email = profile.email || currentUser.email || '';
    const localPhoto = localStorage.getItem('mjPhoto_' + currentUser.uid);
    const photo = localPhoto || currentUser.photoURL || '';

    document.getElementById('userName').textContent = name;
    document.getElementById('userDisplayName').textContent = name;
    document.getElementById('profileDisplayName').textContent = name;
    document.getElementById('profileDisplayEmail').textContent = email;
    document.getElementById('profileName').value = name;

    // Avatar
    if (photo) {
        const img = document.getElementById('userAvatarImg');
        img.src = photo;
        img.style.display = 'block';
        document.getElementById('userAvatarFallback').style.display = 'none';

        const pImg = document.getElementById('profilePhoto');
        pImg.src = photo;
        pImg.style.display = 'block';
        document.getElementById('profilePhotoPlaceholder').style.display = 'none';
    }

    // Fields
    if (profile.targetExam) document.getElementById('profileExam').value = profile.targetExam;
    if (profile.school) document.getElementById('profileSchool').value = profile.school;
    if (profile.city) document.getElementById('profileCity').value = profile.city;
    if (profile.class) document.getElementById('profileClass').value = profile.class;
    if (profile.board) document.getElementById('profileBoard').value = profile.board;
    if (profile.coaching) document.getElementById('profileCoaching').value = profile.coaching;
    if (profile.batch) document.getElementById('profileBatch').value = profile.batch;
    if (profile.coachingCity) document.getElementById('profileCoachingCity').value = profile.coachingCity;
    if (profile.enrollYear) document.getElementById('profileEnrollYear').value = profile.enrollYear;
    if (profile.wakeTime) document.getElementById('profileWake').value = profile.wakeTime;
    if (profile.sleepTime) document.getElementById('profileSleep').value = profile.sleepTime;
}

async function saveProfile() {
    if (!currentUser) return;
    const data = {
        displayName: document.getElementById('profileName').value.trim() || 'Student',
        email: currentUser.email,
        targetExam: document.getElementById('profileExam').value,
        school: document.getElementById('profileSchool').value.trim(),
        city: document.getElementById('profileCity').value.trim(),
        class: document.getElementById('profileClass').value.trim(),
        board: document.getElementById('profileBoard').value,
        coaching: document.getElementById('profileCoaching').value.trim(),
        batch: document.getElementById('profileBatch').value.trim(),
        coachingCity: document.getElementById('profileCoachingCity').value.trim(),
        enrollYear: document.getElementById('profileEnrollYear').value,
        wakeTime: document.getElementById('profileWake').value,
        sleepTime: document.getElementById('profileSleep').value,
        photoURL: profile.photoURL || currentUser.photoURL || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        await userRoot().set(data, { merge: true });
        profile = { ...profile, ...data };
        applyProfile();
        showToast('✅ Profile saved successfully!', 'success', false);
    } catch (err) {
        showToast('❌ Failed to save profile: ' + err.message, 'error');
    }
}

async function uploadProfilePhoto(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
        showToast('❌ Photo must be under 5MB', 'error');
        return;
    }
    try {
        showToast('⏳ Saving photo...', 'info', false);
        const reader = new FileReader();
        reader.onload = async function(e) {
            const dataURL = e.target.result;
            localStorage.setItem('mjPhoto_' + currentUser.uid, dataURL);
            profile.photoLocal = true;

            const img = document.getElementById('userAvatarImg');
            img.src = dataURL; img.style.display = 'block';
            document.getElementById('userAvatarFallback').style.display = 'none';

            const pImg = document.getElementById('profilePhoto');
            pImg.src = dataURL; pImg.style.display = 'block';
            document.getElementById('profilePhotoPlaceholder').style.display = 'none';

            await userRoot().set({ photoLocal: true }, { merge: true });
            showToast('✅ Profile photo saved!', 'success', false);
        };
        reader.readAsDataURL(file);
    } catch (err) {
        showToast('❌ Photo upload failed: ' + err.message, 'error');
    }
}

// ── TASKS ─────────────────────────────────────────────────────
function loadTasks() {
    userDoc('tasks').orderBy('createdAt').onSnapshot(snap => {
        tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderTasks();
        updateDashboard();
    }, err => showToast('❌ Could not load tasks: ' + err.message, 'error'));
}

function renderTasks() {
    const todayKey = getTodayKey();
    const list = document.getElementById('taskList');
    const dashList = document.getElementById('dashTasks');
    const editTable = document.getElementById('editTaskTable');

    if (!tasks.length) {
        list.innerHTML = '<div class="empty-state">No tasks yet. Add your first task!</div>';
        dashList.innerHTML = '<div class="empty-state">No tasks scheduled</div>';
        editTable.innerHTML = '<tr><td colspan="3" style="text-align:center;color:rgba(255,255,255,0.3);padding:20px">No tasks added yet</td></tr>';
        return;
    }

    const todayHistory = dailyHistory[todayKey] || {};

    list.innerHTML = tasks.map(t => taskItemHTML(t, todayHistory[t.id])).join('');
    dashList.innerHTML = tasks.slice(0, 5).map(t => taskItemHTML(t, todayHistory[t.id])).join('');
    editTable.innerHTML = tasks.map(t => {
        const done = todayHistory[t.id];
        return `<tr>
            <td style="font-size:20px">${t.icon || '⚡'}</td>
            <td><div style="font-weight:600">${t.name}</div><div style="font-size:11px;color:rgba(255,255,255,0.4)">${t.detail || ''}</div></td>
            <td>${done ? '<span class="badge badge-green">✅ Done</span>' : '<span class="badge badge-blue">⏳ Pending</span>'}</td>
        </tr>`;
    }).join('');

    // Badge
    const done = tasks.filter(t => todayHistory[t.id]).length;
    const pending = tasks.length - done;
    document.getElementById('taskBadge').textContent = pending;
}

function taskItemHTML(t, done) {
    return `<div class="task-item ${done ? 'completed' : ''}" onclick="toggleTask('${t.id}')">
        <div class="task-check">${done ? '✓' : ''}</div>
        <div class="task-icon">${t.icon || '⚡'}</div>
        <div class="task-info">
            <div class="task-name">${t.name}</div>
            <div class="task-meta">${t.detail || ''}</div>
        </div>
    </div>`;
}

async function toggleTask(taskId) {
    const todayKey = getTodayKey();
    const histRef = userDoc('history').doc(todayKey);
    const todayHistory = dailyHistory[todayKey] || {};
    const isNowDone = !todayHistory[taskId];
    todayHistory[taskId] = isNowDone;
    dailyHistory[todayKey] = todayHistory;

    try {
        await histRef.set(todayHistory, { merge: true });
        renderTasks();
        updateDashboard();
        updateAnalytics();
    } catch (err) {
        showToast('❌ Could not save progress: ' + err.message, 'error');
    }
}

async function resetTasks() {
    const todayKey = getTodayKey();
    dailyHistory[todayKey] = {};
    try {
        await userDoc('history').doc(todayKey).set({});
        renderTasks();
        updateDashboard();
    } catch (err) {
        showToast('❌ Reset failed: ' + err.message, 'error');
    }
}

// ── ADD TASK MODAL ────────────────────────────────────────────
function openTaskModal() {
    document.getElementById('newTaskName').value = '';
    document.getElementById('newTaskIcon').value = '⚡';
    document.getElementById('newTaskDetail').value = '';
    document.getElementById('taskModal').classList.add('open');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('open');
}

async function saveNewTask() {
    const name = document.getElementById('newTaskName').value.trim();
    if (!name) { showToast('❌ Please enter a task name', 'error'); return; }
    const task = {
        name,
        icon: document.getElementById('newTaskIcon').value,
        detail: document.getElementById('newTaskDetail').value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        await userDoc('tasks').add(task);
        closeTaskModal();
        showToast('✅ Task added!', 'success', false);
    } catch (err) {
        showToast('❌ Could not add task: ' + err.message, 'error');
    }
}

// ── TESTS ─────────────────────────────────────────────────────
function loadTests() {
    userDoc('tests').orderBy('date', 'desc').onSnapshot(snap => {
        tests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderTests('all');
        renderEditTests();
        updateDashboard();
        updateTestAnalysis();
    }, err => showToast('❌ Could not load tests: ' + err.message, 'error'));
}

function renderTests(filter) {
    const tbody = document.getElementById('testTableBody');
    let filtered = tests;
    if (filter === 'upcoming') filtered = tests.filter(t => t.status !== 'completed');
    if (filter === 'completed') filtered = tests.filter(t => t.status === 'completed');

    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No tests found</td></tr>`;
        return;
    }
    tbody.innerHTML = filtered.map(t => {
        const pct = t.score !== undefined ? Math.round(t.score / t.maxMarks * 100) : null;
        const statusBadge = t.status === 'completed'
            ? `<span class="badge badge-green">✅ Completed</span>`
            : `<span class="badge badge-blue">⏳ Upcoming</span>`;
        const action = t.status !== 'completed'
            ? `<button class="btn btn-primary btn-sm" onclick="openMarksModal('${t.id}')">Submit Marks</button>`
            : `<span class="badge badge-green">${pct}%</span>`;
        return `<tr>
            <td style="font-weight:600">${t.subject}</td>
            <td>${t.type}</td>
            <td>${formatDate(t.date)}</td>
            <td>${t.maxMarks}</td>
            <td>${t.score !== undefined ? t.score : '—'}</td>
            <td>${statusBadge}</td>
            <td>${action}</td>
        </tr>`;
    }).join('');
}

function renderEditTests() {
    const tbody = document.getElementById('editTestTable');
    if (!tests.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:rgba(255,255,255,0.3);padding:20px">No tests scheduled</td></tr>';
        return;
    }
    tbody.innerHTML = tests.map(t => {
        const locked = t.status === 'completed';
        const actions = locked
            ? '<span style="color:rgba(255,255,255,0.3);font-size:12px">🔒 Locked</span>'
            : `<button class="btn btn-secondary btn-sm" onclick="openEditTestModal('${t.id}')">✏️ Edit</button>`;
        const statusBadge = locked
            ? '<span class="badge badge-green">Completed</span>'
            : '<span class="badge badge-blue">Upcoming</span>';
        return `<tr>
            <td style="font-weight:600">${t.subject}</td>
            <td>${t.type}</td>
            <td>${formatDate(t.date)}</td>
            <td>${t.maxMarks}</td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        </tr>`;
    }).join('');
}

function filterTests(filter, btn) {
    document.querySelectorAll('#tests .btn-secondary').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTests(filter);
}

// ── TEST MODALS ───────────────────────────────────────────────
function openTestModal() {
    currentEditTestId = null;
    document.getElementById('testModalTitle').textContent = 'Schedule Test';
    document.getElementById('newTestSubject').value = 'Physics';
    document.getElementById('newTestType').value = 'Chapter Test';
    document.getElementById('newTestDate').value = '';
    document.getElementById('newTestMarks').value = '100';
    document.getElementById('editTestId').value = '';
    document.getElementById('testModal').classList.add('open');
}

function openEditTestModal(testId) {
    const t = tests.find(x => x.id === testId);
    if (!t || t.status === 'completed') return;
    currentEditTestId = testId;
    document.getElementById('testModalTitle').textContent = 'Edit Test';
    document.getElementById('newTestSubject').value = t.subject;
    document.getElementById('newTestType').value = t.type;
    document.getElementById('newTestDate').value = t.date;
    document.getElementById('newTestMarks').value = t.maxMarks;
    document.getElementById('editTestId').value = testId;
    document.getElementById('testModal').classList.add('open');
}

function closeTestModal() {
    document.getElementById('testModal').classList.remove('open');
    currentEditTestId = null;
}

async function saveNewTest() {
    const date = document.getElementById('newTestDate').value;
    if (!date) { showToast('❌ Please select a date', 'error'); return; }
    const data = {
        subject: document.getElementById('newTestSubject').value,
        type: document.getElementById('newTestType').value,
        date,
        maxMarks: parseInt(document.getElementById('newTestMarks').value) || 100,
        status: 'upcoming'
    };
    try {
        const editId = document.getElementById('editTestId').value;
        if (editId) {
            await userDoc('tests').doc(editId).update(data);
            showToast('✅ Test updated!', 'success', false);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await userDoc('tests').add(data);
            showToast('✅ Test scheduled!', 'success', false);
        }
        closeTestModal();
    } catch (err) {
        showToast('❌ Could not save test: ' + err.message, 'error');
    }
}

function openMarksModal(testId) {
    const t = tests.find(x => x.id === testId);
    if (!t) return;
    currentMarkTestId = testId;
    document.getElementById('marksTestInfo').textContent = `${t.subject} — ${t.type} | ${formatDate(t.date)}`;
    document.getElementById('marksObtained').value = '';
    document.getElementById('marksTotal').value = t.maxMarks;
    document.getElementById('marksModal').classList.add('open');
}

function closeMarksModal() {
    document.getElementById('marksModal').classList.remove('open');
    currentMarkTestId = null;
}

async function submitMarks() {
    const obtained = parseFloat(document.getElementById('marksObtained').value);
    const total = parseFloat(document.getElementById('marksTotal').value);
    if (isNaN(obtained) || isNaN(total) || total <= 0) {
        showToast('❌ Please enter valid marks', 'error');
        return;
    }
    if (obtained > total) {
        showToast('❌ Score cannot exceed total marks', 'error');
        return;
    }
    try {
        await userDoc('tests').doc(currentMarkTestId).update({
            score: obtained,
            maxMarks: total,
            status: 'completed',
            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        closeMarksModal();
        showToast('✅ Results submitted!', 'success', false);
    } catch (err) {
        showToast('❌ Could not submit marks: ' + err.message, 'error');
    }
}

// ── HISTORY ───────────────────────────────────────────────────
function loadDailyHistory() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    userDoc('history').get().then(snap => {
        dailyHistory = {};
        snap.forEach(doc => { dailyHistory[doc.id] = doc.data(); });
        renderTasks();
        updateDashboard();
        updateAnalytics();
        updateConsistency();
        updateTestAnalysis();
    }).catch(err => showToast('❌ Could not load history: ' + err.message, 'error'));
}

// ── DASHBOARD ─────────────────────────────────────────────────
function updateDashboard() {
    const todayKey = getTodayKey();
    const todayHist = dailyHistory[todayKey] || {};
    const done = tasks.filter(t => todayHist[t.id]).length;
    const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;

    document.getElementById('dashProgress').textContent = pct + '%';
    document.getElementById('dashTrend').textContent = done + '/' + tasks.length + ' tasks done';
    document.getElementById('dashStreak').textContent = calculateStreak();
    document.getElementById('sidebarProgress').textContent = pct + '%';
    document.getElementById('sidebarProgressBar').style.width = pct + '%';

    const upcomingTests = tests.filter(t => t.status !== 'completed').length;
    document.getElementById('dashTests').textContent = upcomingTests;
}

// ── ANALYTICS ─────────────────────────────────────────────────
function updateAnalytics() {
    const streak = calculateStreak();
    document.getElementById('analStreak').textContent = streak;

    const completedTests = tests.filter(t => t.status === 'completed' && t.maxMarks);
    const avg = completedTests.length
        ? Math.round(completedTests.reduce((s, t) => s + (t.score / t.maxMarks * 100), 0) / completedTests.length)
        : 0;
    document.getElementById('analAvg').textContent = avg + '%';

    const totalDone = Object.values(dailyHistory).reduce((total, day) => {
        return total + Object.values(day).filter(Boolean).length;
    }, 0);
    document.getElementById('analDone').textContent = totalDone;

    draw14DayChart();
    drawSubjectChart();
}

function draw14DayChart() {
    const ctx = document.getElementById('chart14Day');
    if (!ctx) return;
    if (chartInstances.chart14Day) chartInstances.chart14Day.destroy();

    const labels = [];
    const data = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = getKeyForDate(d);
        const hist = dailyHistory[key] || {};
        const total = tasks.length || 1;
        const done = Object.values(hist).filter(Boolean).length;
        labels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
        data.push(Math.round(done / total * 100));
    }

    chartInstances.chart14Day = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Completion %',
                data,
                backgroundColor: data.map(v => v >= 80 ? 'rgba(5,150,105,0.7)' : v >= 50 ? 'rgba(37,99,235,0.7)' : 'rgba(220,38,38,0.5)'),
                borderRadius: 6,
            }]
        },
        options: chartOptions('Completion %')
    });
}

function drawSubjectChart() {
    const ctx = document.getElementById('chartSubject');
    if (!ctx) return;
    if (chartInstances.chartSubject) chartInstances.chartSubject.destroy();

    const subjects = {};
    tests.filter(t => t.status === 'completed').forEach(t => {
        if (!subjects[t.subject]) subjects[t.subject] = { total: 0, count: 0 };
        subjects[t.subject].total += t.score / t.maxMarks * 100;
        subjects[t.subject].count++;
    });

    const labels = Object.keys(subjects);
    const data = labels.map(s => Math.round(subjects[s].total / subjects[s].count));

    chartInstances.chartSubject = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels.length ? labels : ['Physics', 'Chemistry', 'Maths'],
            datasets: [{
                label: 'Average %',
                data: data.length ? data : [0, 0, 0],
                backgroundColor: 'rgba(37,99,235,0.2)',
                borderColor: '#3b82f6',
                pointBackgroundColor: '#3b82f6',
            }]
        },
        options: {
            ...chartOptions(),
            scales: {
                r: {
                    ticks: { color: 'rgba(255,255,255,0.4)', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } }
                }
            }
        }
    });
}

// ── TEST ANALYSIS ─────────────────────────────────────────────
function updateTestAnalysis() {
    const completed = tests.filter(t => t.status === 'completed');
    const avg = completed.length
        ? Math.round(completed.reduce((s, t) => s + (t.score / t.maxMarks * 100), 0) / completed.length)
        : 0;
    document.getElementById('testAvgValue').textContent = avg + '%';
    document.getElementById('testCountValue').textContent = completed.length;

    const subjects = {};
    completed.forEach(t => {
        if (!subjects[t.subject]) subjects[t.subject] = { total: 0, count: 0 };
        subjects[t.subject].total += t.score / t.maxMarks * 100;
        subjects[t.subject].count++;
    });

    const subjectAvgs = Object.entries(subjects).map(([s, v]) => ({ s, avg: v.total / v.count }));
    if (subjectAvgs.length) {
        subjectAvgs.sort((a, b) => b.avg - a.avg);
        document.getElementById('bestSubjectValue').textContent = subjectAvgs[0].s;
        document.getElementById('bestSubjectScore').textContent = Math.round(subjectAvgs[0].avg) + '% avg';
        document.getElementById('weakSubjectValue').textContent = subjectAvgs[subjectAvgs.length - 1].s;
        document.getElementById('weakSubjectScore').textContent = Math.round(subjectAvgs[subjectAvgs.length - 1].avg) + '% avg';
    }

    // Table
    const tbody = document.getElementById('analysisTestTableBody');
    tbody.innerHTML = completed.slice(0, 10).map((t, i, arr) => {
        const pct = Math.round(t.score / t.maxMarks * 100);
        const prev = arr[i + 1];
        const prevPct = prev ? Math.round(prev.score / prev.maxMarks * 100) : null;
        const trend = prevPct === null ? '—' : pct > prevPct ? '↑' : pct < prevPct ? '↓' : '→';
        const trendColor = trend === '↑' ? '#34d399' : trend === '↓' ? '#f87171' : 'rgba(255,255,255,0.4)';
        return `<tr>
            <td>${formatDate(t.date)}</td>
            <td>${t.subject}</td>
            <td>${t.type}</td>
            <td>${t.score}/${t.maxMarks}</td>
            <td><span style="color:${pct >= 70 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171'};font-weight:700">${pct}%</span></td>
            <td style="color:${trendColor};font-size:16px;font-weight:700">${trend}</td>
        </tr>`;
    }).join('');

    // Subject breakdown
    const breakdown = document.getElementById('subjectBreakdown');
    if (subjectAvgs.length) {
        breakdown.innerHTML = subjectAvgs.map(({ s, avg }) => `
            <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                    <span style="font-size:12px;color:rgba(255,255,255,0.6)">${s}</span>
                    <span style="font-size:12px;font-weight:700;color:${avg >= 70 ? '#34d399' : avg >= 50 ? '#fbbf24' : '#f87171'}">${Math.round(avg)}%</span>
                </div>
                <div style="height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden">
                    <div style="height:100%;width:${Math.round(avg)}%;background:${avg >= 70 ? '#059669' : avg >= 50 ? '#d97706' : '#dc2626'};border-radius:2px;transition:width 1s ease"></div>
                </div>
            </div>
        `).join('');
    } else {
        breakdown.innerHTML = '<div class="empty-state">Complete tests to see subject breakdown</div>';
    }

    drawTestTrendChart();
}

function drawTestTrendChart() {
    const ctx = document.getElementById('chartTestTrend');
    if (!ctx) return;
    if (chartInstances.chartTestTrend) chartInstances.chartTestTrend.destroy();

    const completed = [...tests].filter(t => t.status === 'completed').reverse().slice(0, 10);
    chartInstances.chartTestTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: completed.map(t => t.subject.substring(0, 4) + ' ' + formatDate(t.date)),
            datasets: [{
                label: 'Score %',
                data: completed.map(t => Math.round(t.score / t.maxMarks * 100)),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(37,99,235,0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
            }]
        },
        options: chartOptions('Score %')
    });
}

// ── CONSISTENCY ───────────────────────────────────────────────
function updateConsistency() {
    const streak = calculateStreak();
    document.getElementById('consistencyStreak').textContent = streak;

    const histKeys = Object.keys(dailyHistory);
    const totalDays = histKeys.length;
    const activeDays = histKeys.filter(k => {
        const hist = dailyHistory[k] || {};
        return Object.values(hist).some(Boolean);
    }).length;

    const rate = totalDays ? Math.round(activeDays / totalDays * 100) : 0;
    document.getElementById('completionRate').textContent = rate + '%';

    const score = Math.min(100, Math.round((streak * 3 + rate * 0.5)));
    document.getElementById('consistencyScore').textContent = score;
    const circ = 2 * Math.PI * 52;
    const offset = circ * (1 - score / 100);
    document.getElementById('consistencyRing').style.strokeDashoffset = offset;

    if (score >= 80) document.getElementById('consistencyLabel').textContent = '🏆 Excellent consistency!';
    else if (score >= 60) document.getElementById('consistencyLabel').textContent = '💪 Good progress';
    else if (score >= 40) document.getElementById('consistencyLabel').textContent = '📈 Building habits';
    else document.getElementById('consistencyLabel').textContent = 'Start completing tasks';

    // Weekly avg
    let weekTotal = 0, weekCount = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = getKeyForDate(d);
        const hist = dailyHistory[k] || {};
        const done = Object.values(hist).filter(Boolean).length;
        const total = tasks.length || 1;
        weekTotal += done / total * 100;
        weekCount++;
    }
    document.getElementById('weeklyAvg').textContent = Math.round(weekTotal / weekCount) + '%';

    drawConsistencyChart();
    drawWeeklyChart();
    updateInsights();
}

function drawConsistencyChart() {
    const ctx = document.getElementById('chartConsistency');
    if (!ctx) return;
    if (chartInstances.chartConsistency) chartInstances.chartConsistency.destroy();

    const labels = [], data = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = getKeyForDate(d);
        const hist = dailyHistory[k] || {};
        const done = Object.values(hist).filter(Boolean).length;
        const total = tasks.length || 1;
        labels.push(i === 0 ? 'Today' : d.getDate() + '');
        data.push(Math.round(done / total * 100));
    }

    chartInstances.chartConsistency = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: '% Completion',
                data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(37,99,235,0.1)',
                tension: 0.3,
                fill: true,
                pointRadius: 2,
            }]
        },
        options: chartOptions('Completion %')
    });
}

function drawWeeklyChart() {
    const ctx = document.getElementById('chartWeekly');
    if (!ctx) return;
    if (chartInstances.chartWeekly) chartInstances.chartWeekly.destroy();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sums = new Array(7).fill(0), counts = new Array(7).fill(0);

    Object.entries(dailyHistory).forEach(([k, hist]) => {
        const d = new Date(k.replace(/-/g, '/'));
        const dow = d.getDay();
        const done = Object.values(hist).filter(Boolean).length;
        const total = tasks.length || 1;
        sums[dow] += done / total * 100;
        counts[dow]++;
    });

    const data = sums.map((s, i) => counts[i] ? Math.round(s / counts[i]) : 0);

    chartInstances.chartWeekly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Avg Completion %',
                data,
                backgroundColor: 'rgba(37,99,235,0.6)',
                borderRadius: 6,
            }]
        },
        options: chartOptions('Avg %')
    });
}

function updateInsights() {
    const streak = calculateStreak();
    document.getElementById('strengthInsight').textContent = streak >= 3
        ? `You've maintained a ${streak}-day streak! Great consistency.`
        : 'Complete tasks daily to build your streak';

    const hist = dailyHistory;
    const recentMissed = [];
    for (let i = 1; i <= 7; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const k = getKeyForDate(d);
        const h = hist[k] || {};
        if (!Object.values(h).some(Boolean)) recentMissed.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
    }
    document.getElementById('watchInsight').textContent = recentMissed.length
        ? `Missed: ${recentMissed.slice(0, 3).join(', ')}. Don't break the chain!`
        : 'No missed days this week — excellent!';

    const hour = new Date().getHours();
    document.getElementById('tipInsight').textContent = hour < 10
        ? 'Morning sessions are your most productive. Start now!'
        : hour < 14
        ? 'Peak focus window — tackle the hardest subject first'
        : 'Afternoon slump? Take a 10-min break then dive back in';
}

// ── SECTION NAVIGATION ────────────────────────────────────────
const sectionTitles = {
    dashboard: 'Dashboard', tasks: "Today's Tasks", tests: 'Test Arsenal',
    analytics: 'Analytics', testAnalysis: 'Test Analysis',
    consistency: 'Consistency', edit: 'Settings'
};

function showSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (btn && btn.classList) btn.classList.add('active');
    document.getElementById('pageTitle').textContent = sectionTitles[id] || id;

    if (id === 'analytics') { updateAnalytics(); }
    if (id === 'testAnalysis') { updateTestAnalysis(); }
    if (id === 'consistency') { updateConsistency(); }
    if (id === 'edit') { renderEditTests(); renderTasks(); }
}

function showEditTab(panelId, btn) {
    document.querySelectorAll('.edit-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.edit-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(panelId).classList.add('active');
    if (btn && btn.classList) btn.classList.add('active');
}

// ── QUOTES ────────────────────────────────────────────────────
const quotes = [
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The difference between ordinary and extraordinary is practice.", author: "Vladimir Horowitz" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Believe it. Build it.", author: "Unknown" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
];

function refreshQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('dashQuote').textContent = `"${q.text}"`;
    document.getElementById('dashQuoteAuthor').textContent = `— ${q.author}`;
}

// ── CHART OPTIONS ─────────────────────────────────────────────
function chartOptions(label) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,15,30,0.95)',
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } },
                beginAtZero: true,
                max: label && label.includes('%') ? 100 : undefined
            }
        }
    };
}

// ── TOAST ─────────────────────────────────────────────────────
// Only errors are shown for cloud sync operations.
// Local UI events (task added, profile saved) can show success toasts.
function showToast(message, type = 'info', autoClose = true) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    if (autoClose !== false) {
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    } else {
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
    }
}

// ── HELPERS ───────────────────────────────────────────────────
function getTodayKey() {
    return getKeyForDate(new Date());
}

function getKeyForDate(date) {
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');
}

function formatDate(str) {
    if (!str) return '—';
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}

function calculateStreak() {
    let streak = 0;
    const d = new Date();
    while (true) {
        const k = getKeyForDate(d);
        const hist = dailyHistory[k] || {};
        const done = Object.values(hist).filter(Boolean).length;
        if (!done) {
            if (streak === 0 && k === getTodayKey()) {
                d.setDate(d.getDate() - 1);
                continue;
            }
            break;
        }
        streak++;
        d.setDate(d.getDate() - 1);
        if (streak > 365) break;
    }
    return streak;
}

// ── INIT ─────────────────────────────────────────────────────
initParticles();

// ── EXPOSE GLOBALS (for React JSX event handlers) ────────────
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.showSection = showSection;
window.showEditTab = showEditTab;
window.toggleTask = toggleTask;
window.resetTasks = resetTasks;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.saveNewTask = saveNewTask;
window.openTestModal = openTestModal;
window.closeTestModal = closeTestModal;
window.openEditTestModal = openEditTestModal;
window.saveNewTest = saveNewTest;
window.openMarksModal = openMarksModal;
window.closeMarksModal = closeMarksModal;
window.submitMarks = submitMarks;
window.filterTests = filterTests;
window.refreshQuote = refreshQuote;
window.saveProfile = saveProfile;
window.uploadProfilePhoto = uploadProfilePhoto;
