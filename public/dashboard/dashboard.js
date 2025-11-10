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

  const stats = {
    today: 128,
    month: 3420,
    year: 9583
  };

  function formatNumber(n){
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function initPeriodSelector(){
    const periodButton = document.getElementById('periodButton');
    const periodList = document.getElementById('periodList');
    if(!periodButton || !periodList) return;
    const items = Array.from(periodList.querySelectorAll('li'));
    function closeList(){
      periodList.hidden = true;
      periodButton.setAttribute('aria-expanded', 'false');
    }
    function openList(){
      periodList.hidden = false;
      periodButton.setAttribute('aria-expanded', 'true');
      const current = items.find(i => i.getAttribute('aria-current') === 'true');
      if(current) current.focus(); else items[0].focus();
    }
    periodButton.addEventListener('click', (e) => {
      const isOpen = !periodList.hidden;
      if(isOpen) closeList(); else openList();
    });
    document.addEventListener('click', (e) => {
      if(periodList.hidden) return;
      if(!periodButton.contains(e.target) && !periodList.contains(e.target)) closeList();
    });
    document.addEventListener('keydown', (e) => {
      if(periodList.hidden) return;
      const currentIndex = items.indexOf(document.activeElement);
      if(e.key === 'ArrowDown'){
        e.preventDefault();
        const next = items[(currentIndex + 1) % items.length];
        next.focus();
      } else if(e.key === 'ArrowUp'){
        e.preventDefault();
        const prev = items[(currentIndex - 1 + items.length) % items.length];
        prev.focus();
      } else if(e.key === 'Escape'){
        closeList();
        periodButton.focus();
      } else if(e.key === 'Enter'){
        if(document.activeElement && items.includes(document.activeElement)){
          document.activeElement.click();
        }
      }
    });
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.removeAttribute('aria-current'));
        item.setAttribute('aria-current', 'true');
        const key = item.getAttribute('data-period') || 'today';
        const label = item.textContent.trim();
        periodButton.textContent = label + ' ▾';
        updateStatsForPeriod(key);
        closeList();
        periodButton.focus();
      });
      item.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') item.click();
      });
    });
    const initial = items.find(i => i.getAttribute('aria-current') === 'true') || items[0];
    if(initial){
      const key = initial.getAttribute('data-period') || 'today';
      periodButton.textContent = initial.textContent.trim() + ' ▾';
      updateStatsForPeriod(key);
    }
  }

  function updateStatsForPeriod(periodKey){
    const v = stats[periodKey] || stats.today;
    const visitorsEl = document.getElementById('today-visitors');
    if(visitorsEl) visitorsEl.textContent = formatNumber(v);
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
    initPeriodSelector();
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
    else initPeriodSelector();
  });

  window.__visiter = {
    initDashboardPage
  };
})();