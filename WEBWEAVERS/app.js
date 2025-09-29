// DATA: demo datasets (replace with API calls later)
const DATA = {
  societies: [
    { id: 1, name: "Computer Society", desc: "Workshops, coding contests and projects." },
    { id: 2, name: "Communication Society", desc: "Embedded & comms research and labs." },
    { id: 3, name: "SIGHT", desc: "Humanitarian technology initiatives." },
    { id: 4, name: "WIE", desc: "Women in Engineering activities." }
  ],
  team: [
    { name: "Alice Kumar", position: "Chair", photo: "https://via.placeholder.com/500x300?text=Chair" },
    { name: "Ravi Nair", position: "Vice Chair", photo: "https://via.placeholder.com/500x300?text=Vice+Chair" },
    { name: "Sneha Rao", position: "Secretary", photo: "https://via.placeholder.com/500x300?text=Secretary" }
  ],
  events: [
    { id: 101, title: "AI Workshop", organizer: 1, description: "Hands-on AI workshop with labs.", start: "2025-10-05T10:00", venue: "Auditorium", cover: "https://via.placeholder.com/800x400?text=AI+Workshop", published: true },
    { id: 102, title: "Embedded Systems Lab", organizer: 2, description: "Intro to microcontrollers.", start: "2025-11-20T09:30", venue: "Lab 3", cover: "https://via.placeholder.com/800x400?text=Embedded+Systems", published: true },
  ],
  publications: [
    { title: "Robotics Newsletter - Vol 5", link: "#", date: "2024-12-10" },
    { title: "Student Research Digest", link: "#", date: "2025-02-25" }
  ],
  achievements: [
    { title: "Team won SmartIndia Hackathon", date: "2025-03-10", desc: "National-level prize" }
  ],
  announcements: "Welcome to the IEEE Student Branch SMVITM demo site!"
};

// Helpers
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
const toastContainer = qs('#toastContainer');

// ROUTING (client-side)
const pages = qsa('.page');
function showPage(id) {
  pages.forEach(p => p.id === id ? p.classList.remove('d-none') : p.classList.add('d-none'));
  // update active nav
  qsa('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route === id));
}
qsa('[data-route]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();
  const route = el.dataset.route;
  showPage(route);
  if(route === 'home') renderUpcoming();
  if(route === 'societies') renderSocieties();
  if(route === 'events') renderEvents();
  if(route === 'team') renderTeam();
  if(route === 'achievements') renderAchievements();
  if(route === 'publications') renderPublications();
}));

// Initial render
document.getElementById('year').textContent = new Date().getFullYear();
qs('#latestAnnouncement').textContent = DATA.announcements;
renderUpcoming();

// Render functions
function renderUpcoming(){
  const row = qs('#upcomingRow'); row.innerHTML = '';
  const upcoming = DATA.events.slice(0,3);
  upcoming.forEach(ev => {
    const col = document.createElement('div'); col.className='col-md-4';
    col.innerHTML = `
      <div class="card event-card h-100">
        <img src="${ev.cover}" class="card-img-top" alt="">
        <div class="card-body">
          <h5 class="card-title">${ev.title}</h5>
          <p class="card-text text-muted small">${new Date(ev.start).toLocaleString()} • ${ev.venue}</p>
          <p class="card-text">${(ev.description||'').slice(0,100)}...</p>
        </div>
        <div class="card-footer bg-white">
          <button class="btn btn-sm btn-primary view-event" data-id="${ev.id}">View</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  // attach view handlers
  qsa('.view-event').forEach(btn => btn.addEventListener('click', e => openEventDetail(+e.target.dataset.id)));
}

function renderSocieties(){
  const row = qs('#societiesList'); row.innerHTML = '';
  DATA.societies.forEach(s => {
    const col = document.createElement('div'); col.className='col-md-6';
    col.innerHTML = `
      <div class="society-badge p-3 mb-2">
        <div class="flex-grow-1">
          <h5 class="mb-1">${s.name}</h5>
          <div class="text-muted">${s.desc}</div>
        </div>
        <div class="text-end">
          <button class="btn btn-outline-primary btn-sm view-society" data-id="${s.id}">Open</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  qsa('.view-society').forEach(b => b.addEventListener('click', e => {
    const id = +e.target.dataset.id;
    const soc = DATA.societies.find(x=>x.id===id);
    notify(`${soc.name}`, soc.desc);
  }));
}

function renderEvents(filter=''){
  const row = qs('#eventsRow'); row.innerHTML = '';
  const items = DATA.events.filter(ev => ev.title.toLowerCase().includes(filter.toLowerCase()));
  if(!items.length) row.innerHTML = `<div class="col-12"><div class="alert alert-info">No events</div></div>`;
  items.forEach(ev => {
    const col = document.createElement('div'); col.className='col-md-6';
    col.innerHTML = `
      <div class="card mb-2 event-card">
        <div class="row g-0">
          <div class="col-md-5"><img src="${ev.cover}" class="img-fluid rounded-start" alt=""></div>
          <div class="col-md-7">
            <div class="card-body">
              <h5>${ev.title}</h5>
              <p class="text-muted small">${new Date(ev.start).toLocaleString()} • ${ev.venue}</p>
              <p>${(ev.description||'').slice(0,140)}...</p>
              <div class="d-flex justify-content-between">
                <button class="btn btn-sm btn-primary view-event" data-id="${ev.id}">Details</button>
                <div><button class="btn btn-outline-secondary btn-sm me-1">Share</button><span class="badge bg-secondary">#${ev.id}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  qsa('.view-event').forEach(btn => btn.addEventListener('click', e => openEventDetail(+e.target.dataset.id)));
}

// Team
function renderTeam(){
  const row = qs('#teamRow'); row.innerHTML = '';
  DATA.team.forEach(t => {
    const col = document.createElement('div'); col.className='col-md-4';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${t.photo}" alt="" class="team-photo card-img-top">
        <div class="card-body">
          <h5>${t.name}</h5>
          <p class="text-muted mb-1">${t.position}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary">Profile</button>
            <button class="btn btn-sm btn-outline-secondary">Message</button>
          </div>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
}

function renderAchievements(){
  const row = qs('#achieveRow'); row.innerHTML = '';
  DATA.achievements.forEach(a => {
    const col = document.createElement('div'); col.className='col-md-6';
    col.innerHTML = `
      <div class="card p-3">
        <h5>${a.title}</h5>
        <div class="text-muted small">${a.date}</div>
        <p class="mb-0">${a.desc}</p>
      </div>
    `;
    row.appendChild(col);
  });
}

function renderPublications(){
  const list = qs('#pubRow'); list.innerHTML = '';
  DATA.publications.forEach(p => {
    const a = document.createElement('a');
    a.href = p.link || '#';
    a.className = 'list-group-item list-group-item-action';
    a.innerHTML = `<div class="d-flex justify-content-between"><div>${p.title}</div><small class="text-muted">${p.date}</small></div>`;
    list.appendChild(a);
  });
}

// Event details
function openEventDetail(id){
  const ev = DATA.events.find(x=>x.id===id);
  if(!ev) return notify('Event not found', null, 'danger');
  qs('#detailTitle').textContent = ev.title;
  qs('#detailBody').innerHTML = `
    <img src="${ev.cover}" alt="" class="img-fluid mb-3 rounded">
    <p class="text-muted">${new Date(ev.start).toLocaleString()} • ${ev.venue}</p>
    <p>${ev.description || 'No description.'}</p>
  `;
  const modal = new bootstrap.Modal(qs('#eventDetailModal'));
  modal.show();
}

// Tiny toast helper
function notify(title, body='', type='success', timeout=3000){
  const id = 't'+Date.now();
  const el = document.createElement('div');
  el.className = 'toast align-items-center text-bg-'+(type==='danger'?'danger':type)+' border-0 show';
  el.role = 'alert';
  el.ariaLive = 'assertive';
  el.ariaAtomic = 'true';
  el.id = id;
  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><div class="small">${body||''}</div>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  toastContainer.appendChild(el);
  setTimeout(()=> {
    try { el.classList.remove('show'); el.remove(); } catch(e){}
  }, timeout);
}

// Login (client-only fake)
qs('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = qs('#loginEmail').value.trim();
  const modalEl = qs('#loginModal');
  bootstrap.Modal.getInstance(modalEl).hide();
  notify('Logged in', `Welcome ${email}`, 'success');
});

// Subscribe button
qs('#subscribeBtn').addEventListener('click', () => {
  const email = prompt('Enter your email to subscribe:');
  if(email) notify('Subscribed', `Thanks — ${email} added to demo list.`);
});

// Event creation form (client-only)
function populateOrganizerOptions(){
  const sel = qs('#evOrganizer'); sel.innerHTML = '';
  DATA.societies.forEach(s => {
    const opt = document.createElement('option'); opt.value = s.id; opt.textContent = s.name;
    sel.appendChild(opt);
  });
}
populateOrganizerOptions();

qs('#evImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const preview = qs('#evPreview'); preview.innerHTML = '';
  if(!file) return;
  const img = document.createElement('img');
  img.className = 'img-fluid rounded shadow-sm';
  img.style.maxHeight = '140px';
  preview.appendChild(img);
  const reader = new FileReader();
  reader.onload = () => img.src = reader.result;
  reader.readAsDataURL(file);
});

qs('#eventForm').addEventListener('submit', e => {
  e.preventDefault();
  const newEv = {
    id: Math.floor(Math.random()*10000),
    title: qs('#evTitle').value || 'Untitled',
    organizer: +qs('#evOrganizer').value,
    description: qs('#evDesc').value,
    start: qs('#evStart').value,
    venue: qs('#evVenue').value,
    cover: qs('#evPreview img') ? qs('#evPreview img').src : 'https://via.placeholder.com/800x400?text=Event'
  };
  DATA.events.unshift(newEv);
  bootstrap.Modal.getInstance(qs('#eventModal')).hide();
  notify('Event added (demo)', newEv.title);
  renderEvents();
});

// search events
qs('#searchEvents').addEventListener('input', e => renderEvents(e.target.value));

// New event button for demo: only show if JS allowed
if(!qs('#newEventBtn')){ /* noop */ }

// Make events clickable from home initially
document.addEventListener('DOMContentLoaded', () => {
  renderUpcoming();
  renderEvents();
});

// Example: send a demo announcement toast after a short delay
setTimeout(()=> notify('Welcome', 'IEEE SMVITM demo site loaded'), 800);
