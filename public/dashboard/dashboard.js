(function(){
  const THEME_KEY = 'visiter:theme';
  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function applyTheme(theme){
    if(theme === 'light'){
      document.body.classList.add('light-theme');
    }else{
      document.body.classList.remove('light-theme');
    }
  }
  function toggleTheme(){
    const current = localStorage.getItem(THEME_KEY) || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }
  function initTheme(){
    const btn = document.getElementById('theme-btn');
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);
    if(btn) btn.addEventListener('click', toggleTheme);
  }
  function initDashboardPage(){
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag') || '';
    const name = params.get('name') || '';
    const tagParamEl = document.getElementById('tagParam');
    const tagNameEl = document.getElementById('tagNameDisplay') || document.getElementById('tagName');
    if(tagParamEl) tagParamEl.textContent = tag || '(vide)';
    if(tagNameEl) tagNameEl.textContent = name || '(vide)';
    const mapEl = document.getElementById('map');
    if(!mapEl) return;
    const map = L.map('map', {center:[20,0], zoom:2, attributionControl:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    const marker = L.circleMarker([20,0],{radius:8, color:'#1db954', fillColor:'#1db954', fillOpacity:0.24}).addTo(map);
    map.on('click', e=>{
      marker.setLatLng(e.latlng);
      map.panTo(e.latlng);
    });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    initTheme();
    if(document.getElementById('map')) initDashboardPage();
  });
  window.__visiter = {
    initDashboardPage
  };
})();