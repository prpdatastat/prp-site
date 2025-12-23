(function(){
  const container = document.getElementById('notifSlides');
  const controls = document.getElementById('notifControls');
  const prevBtn = document.getElementById('notifPrev');
  const nextBtn = document.getElementById('notifNext');
  let slides = [];
  let current = 0;
  let timer = null;
  const rotateInterval = 6000;

  const typeClasses = {
    urgent: 'badge badge-urgent',
    announcement: 'badge badge-announcement',
    info: 'badge badge-info',
    fcps: 'badge badge-fcps',
    default: 'badge badge-default'
  };

  function makeSlide(n) {
    const badgeCls = typeClasses[n.type] || typeClasses.default;
    const slide = document.createElement('div');
    slide.className = 'notif-slide neon-box';
    slide.setAttribute('data-id', n.id);
    slide.innerHTML = `
      <div class="notif-left">
        <span class="badge ${badgeCls}">${escapeHtml(n.type.toUpperCase())}</span>
      </div>
      <div class="notif-body">
        <a href="${n.link || '#'}" class="notif-title">${escapeHtml(n.title)}</a>
        <div class="notif-message">${escapeHtml(n.message)}</div>
      </div>
    `;
    slide.style.display = 'none';
    return slide;
  }

  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render(data){
    slides = data;
    container.innerHTML = '';
    controls.innerHTML = '';
    data.forEach((n, idx) => {
      const s = makeSlide(n);
      container.appendChild(s);
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.setAttribute('aria-label', 'Show notification '+(idx+1));
      dot.onclick = () => showIndex(idx);
      controls.appendChild(dot);
    });
    if (data.length) showIndex(0);
    startTimer();
  }

  function showIndex(i){
    const nodes = container.children;
    for (let k=0;k<nodes.length;k++){
      nodes[k].style.display = k===i ? 'flex' : 'none';
    }
    Array.from(controls.children).forEach((c, idx)=>{
      c.classList.toggle('opacity-100', idx===i);
      c.classList.toggle('opacity-60', idx!==i);
    });
    current = i;
  }

  function startTimer(){
    stopTimer();
    timer = setInterval(()=>{
      const next = (current+1) % Math.max(1, slides.length);
      showIndex(next);
    }, rotateInterval);
  }
  function stopTimer(){ if (timer) { clearInterval(timer); timer = null; } }

  prevBtn && (prevBtn.onclick = ()=>{ stopTimer(); showIndex((current-1+slides.length)%slides.length); startTimer(); });
  nextBtn && (nextBtn.onclick = ()=>{ stopTimer(); showIndex((current+1)%slides.length); startTimer(); });

  // Pause on hover to let user read
  const wrap = document.getElementById('notifCarousel');
  wrap && wrap.addEventListener('mouseenter', stopTimer);
  wrap && wrap.addEventListener('mouseleave', startTimer);

  async function load(){
    try{
      const res = await fetch('notifications.json', {cache: 'no-store'});
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      render(data);
    }catch(err){
      console.warn('Failed to load notifications.json, using fallback', err);
      render([{ id: 'fallback', type:'info', title:'Notifications unavailable', message:'Could not load notifications.json — update file to change slides', link:'#' }]);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', load);
})();