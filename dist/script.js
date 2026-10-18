const projectData = [{"id": "farmart", "title": "FarMart.co", "category": "Digital", "tags": "digital", "image": "farmart.png", "url": "https://www.behance.net/gallery/202132127/FarMartco", "desc": "A digital home for the good food economy. Explore the FarMart website design project.", "number": "01"}, {"id": "saudabook", "title": "SaudaBook", "category": "Brand & digital", "tags": "brand digital", "image": "saudabook.jpg", "url": "https://www.behance.net/gallery/202164215/SaudaBook", "desc": "A brand and digital project for SaudaBook, powered by FarMart.", "number": "02"}, {"id": "magazine", "title": "Magazine Ads", "category": "Campaigns & print", "tags": "campaign", "image": "magazine.png", "url": "https://www.behance.net/gallery/126270617/Magazine-Ads", "desc": "A collection of magazine advertising, bringing imagery, typography and copy into one frame.", "number": "03"}, {"id": "digital", "title": "Digital Ads", "category": "Campaigns & digital", "tags": "campaign digital", "image": "digital.png", "url": "https://www.behance.net/gallery/126246883/Digital-Ads", "desc": "Digital advertising across consumer brands, with ideas designed for the feed.", "number": "04"}, {"id": "logos", "title": "Branding", "category": "Visual identities", "tags": "brand", "image": "branding/accelscale-cover.webp", "url": "/branding/", "desc": "Five distinct brand identities: Big DJ Bash, accelScale, Furr, Domina and Status Tag.", "number": "05", "page": "/branding/", "action": "EXPLORE THE IDENTITIES ↗"}, {"id": "ai-video", "title": "AI Videos", "category": "", "tags": "ai film motion", "image": "ai-films/sugar-watchers-noodles.jpg", "url": "/ai-video/", "desc": "AI-generated ads for Truly Safe and Sugar Watchers, plus EverGrain tutorials.", "number": "06", "page": "/ai-video/", "action": "WATCH THE ADS ↗"}, {"id": "events", "title": "Events & Experiences", "category": "Branding · Print · Execution", "tags": "events brand print", "image": "events/aahar-selected-04.webp", "url": "/events/", "page": "/events/", "action": "VIEW THE EVENTS ↗", "desc": "Event branding, print production and on-ground execution for FarMart. Dashak, Aahar 2025, and annual offsites in Jaipur and Hyderabad.", "number": "07"}];
const testimonials = [{"name": "POOJA GUPTA", "role": "Senior Manager \u2013 Brand & Growth | Sirona", "tagline": "Former Boss, Current Survivor", "quote": "\u201cA natural creative thinker with an exceptional eye for design.\u201d", "alternate": "\u201cManaging him should count as work experience.\u201d", "image": "pooja-photo.png"}, {"name": "SAMRIDHI SINGH", "role": "Vice President | Avaana Capital", "tagline": "Survived Managing Me", "quote": "\u201cSomeone you can trust to take an idea further.\u201d", "alternate": "\u201cI trusted his creative process. Eventually.\u201d", "image": "samridhi-photo.png"}, {"name": "KARAN SINGHA", "role": "Associate Account Director | Cheil India", "tagline": "Former Partner in Creative Crime", "quote": "\u201cAn incredible creative mind and an even better teammate.\u201d", "alternate": "\u201cWe worked together. I deserve a testimonial too.\u201d", "image": "karan-photo.png"}];
let activeTestimonial=0, testimonialManualUntil=0;
const main = document.querySelector('main');
const dialog = document.getElementById('project-dialog');
const viewport = document.querySelector('.reveal-viewport');
const mirror = document.querySelector('.reveal-mirror');
const musicSwitch = document.querySelector('.music-switch');
const heroVideo = document.querySelector('.hero-video');
const menuButton = document.querySelector('.menu-button');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionEnabled = !prefersReduced.matches;
let pointerInside = false;
let targetX = -50, targetY = -50, targetRadius = 6;
let cursorX = -50, cursorY = -50, cursorRadius = 6;
let cursorFrame = null, lastFrameTime = 0;
let latchedIcon = null;
function releaseIcon() {
  if (!latchedIcon) return;
  latchedIcon.classList.remove('magnetic-active');
  latchedIcon.style.removeProperty('--magnet-x');
  latchedIcon.style.removeProperty('--magnet-y');
  latchedIcon = null;
}
let animatedText = [];
let mirrorQueued = false;
let showcaseIndex = 0, showcaseTimer = null;

// One viewport reveal, one eased cursor, across the entire page.
const largeRadius = () => Math.min(300, Math.max(145, window.innerWidth * 0.14));
function paintCursor() {
  viewport.style.setProperty('--reveal-x', cursorX + 'px');
  viewport.style.setProperty('--reveal-y', cursorY + 'px');
  viewport.style.setProperty('--reveal-r', cursorRadius + 'px');
}
function animateCursor(time) {
  const dt = lastFrameTime ? Math.min(50, Math.max(1, time - lastFrameTime)) : 16.67;
  lastFrameTime = time;
  const follow = 1 - Math.exp(-dt / 95);
  const sizeEase = 1 - Math.exp(-dt / (targetRadius > cursorRadius ? 125 : 95));
  cursorX += (targetX - cursorX) * follow;
  cursorY += (targetY - cursorY) * follow;
  cursorRadius += (targetRadius - cursorRadius) * sizeEase;
  paintCursor();
  const remaining = Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) + Math.abs(targetRadius - cursorRadius);
  if (remaining > 0.15 && motionEnabled) cursorFrame = requestAnimationFrame(animateCursor);
  else { cursorFrame = null; lastFrameTime = 0; }
}
function requestCursor() {
  if (!motionEnabled) {
    if (cursorFrame !== null) cancelAnimationFrame(cursorFrame);
    cursorFrame = null; lastFrameTime = 0;
    cursorX = targetX; cursorY = targetY; cursorRadius = targetRadius; paintCursor();
  } else if (cursorFrame === null) cursorFrame = requestAnimationFrame(animateCursor);
}
function syncScroll() {
  updateTextReveal();
  mirror.style.transform = 'translateY(' + main.getBoundingClientRect().top + 'px)';
  syncTestimonialScroll();
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.scroll-progress').style.transform = 'scaleX(' + (total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0) + ')';
}
function rebuildMirror() {
  fitExpertiseTitles();
  reserveAboutSpace();
  const copy = main.cloneNode(true);
  copy.removeAttribute('id');
  copy.classList.add('mirror-main');
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('inert', '');
  copy.querySelectorAll('iframe').forEach(frame => frame.remove());
  copy.querySelectorAll('.motto-video').forEach(video => video.remove());
  copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  copy.querySelectorAll('.revealing').forEach(element => { element.classList.remove('revealing'); element.classList.add('visible'); });
  const originalTargets = main.querySelectorAll('.reveal-target');
  const copyTargets = copy.querySelectorAll('.reveal-target');
  copyTargets.forEach((element, index) => {
    const original = originalTargets[index];
    const bounds = original.getBoundingClientRect();
    if (element.dataset.alt) element.innerHTML = element.dataset.alt;
    element.style.height = bounds.height + 'px';
    element.style.minHeight = bounds.height + 'px';
    element.style.width = bounds.width + 'px';
    element.style.overflow = 'hidden';
  });
  mirror.replaceChildren(copy);
  mirror.style.width = main.getBoundingClientRect().width + 'px';
  // Hero typography is locked; other longer alternate copy fits its existing slot.
  copyTargets.forEach(element => {
    if (element.matches('.hero-heading, .about-copy, .experience-copy, .work-copy, .testimonial-quote, .contact-title, .motto-copy')) return;
    let size = parseFloat(getComputedStyle(element).fontSize);
    for (let count = 0; count < 18 && (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2); count++) {
      if (size <= 12) break;
      size = Math.max(12, size * 0.94); element.style.fontSize = size + 'px';
    }
  });
  copy.querySelectorAll('video').forEach(video => video.remove());
  syncScroll();
  mirrorQueued = false;
}
function queueMirror() {
  if (mirrorQueued) return;
  mirrorQueued = true;
  requestAnimationFrame(rebuildMirror);
}
rebuildMirror();
if ('ResizeObserver' in window) new ResizeObserver(queueMirror).observe(main);
window.addEventListener('resize', () => { queueMirror(); releaseIcon(); targetRadius = 6; requestCursor(); });
let scrollQueued = false;
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(() => { syncScroll(); scrollQueued = false; }); } }, { passive: true });

if (finePointer) {
  document.addEventListener('pointermove', event => {
    if (dialog.open || document.body.classList.contains('is-loading')) { releaseIcon(); document.body.classList.remove('pointer-present'); return; }
    targetX = event.clientX; targetY = event.clientY;
    if (!pointerInside) { cursorX = targetX; cursorY = targetY; pointerInside = true; }
    document.body.classList.toggle('skill-hover', Boolean(event.target.closest('.skill-row')));
    const text = event.target.closest('.reveal-target, .hero-text');
    const navigation = event.target.closest('a, button');
    const icon = event.target.closest('.corner-mark, .social-rail a');
    if (icon) {
      if (latchedIcon !== icon) { releaseIcon(); latchedIcon = icon; icon.classList.add('magnetic-active'); }
      const bounds = icon.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const pullX = (event.clientX - centerX) * 0.2;
      const pullY = (event.clientY - centerY) * 0.2;
      icon.style.setProperty('--magnet-x', pullX + 'px');
      icon.style.setProperty('--magnet-y', pullY + 'px');
      targetX = centerX + pullX; targetY = centerY + pullY;
      targetRadius = icon.matches('.corner-mark') ? bounds.width / 2 + 4 : bounds.width / 2 + 1;
    } else {
      releaseIcon();
      targetRadius = text ? largeRadius() : navigation ? 15 : 6;
    }
    document.body.classList.add('pointer-present');
    requestCursor();
  });
  document.addEventListener('pointerleave', () => {
    releaseIcon();
    pointerInside = false; document.body.classList.remove('pointer-present', 'skill-hover');
    targetRadius = cursorRadius = 6;
    if (cursorFrame !== null) cancelAnimationFrame(cursorFrame);
    cursorFrame = null; lastFrameTime = 0; paintCursor();
  });
}
function plainAlternate(element) {
  const temporary = document.createElement('div'); temporary.innerHTML = element.dataset.alt || '';
  return temporary.textContent;
}
main.addEventListener('focusin', event => {
  const target = event.target.closest('.reveal-target');
  if (!target || !target.matches(':focus-visible')) return;
  const bounds = target.getBoundingClientRect();
  targetX = bounds.left + bounds.width / 2; targetY = bounds.top + bounds.height / 2;
  targetRadius = largeRadius(); document.body.classList.add('keyboard-reveal'); requestCursor();
  document.getElementById('reveal-announcement').textContent = 'Alternate copy: ' + plainAlternate(target);
});
main.addEventListener('focusout', () => { document.body.classList.remove('keyboard-reveal'); targetRadius = 6; requestCursor(); });
function setMotion(enabled) {
  motionEnabled = enabled;
  document.body.classList.toggle('motion-off', !enabled);
  document.documentElement.style.scrollBehavior = enabled ? '' : 'auto';
  if (!enabled) { stopShowcase(); requestCursor(); heroVideo.pause(); }
  else if (document.body.classList.contains('experience-ready')) heroVideo.play().catch(() => {});
}
setMotion(motionEnabled);
prefersReduced.addEventListener('change', event => setMotion(!event.matches));

const musicAudio = document.querySelector('.portfolio-audio');
let musicOn = false, musicRequest = 0;
function renderMusic() {
  musicSwitch.setAttribute('aria-pressed', String(musicOn));
  musicSwitch.setAttribute('aria-label', musicOn ? 'Turn music off' : 'Turn music on');
  musicSwitch.querySelector('span').textContent = musicOn ? 'ON' : 'OFF';
  document.body.classList.toggle('music-playing', musicOn);
}
async function setMusic(enabled) {
  const request = ++musicRequest;
  if (!enabled) { musicOn = false; musicAudio.pause(); renderMusic(); document.getElementById('music-status').textContent = 'Music off.'; return; }
  musicOn = true; renderMusic();
  musicAudio.volume = 0.35;
  try {
    await musicAudio.play();
    if (request !== musicRequest) { if (!musicOn) musicAudio.pause(); return; }
    musicOn = true;
    document.getElementById('music-status').textContent = 'Music on.';
  } catch {
    if (request !== musicRequest) return;
    musicOn = false;
    document.getElementById('music-status').textContent = 'Select Music on to start the soundtrack.';
  }
  renderMusic();
}
musicSwitch.addEventListener('click', () => setMusic(!musicOn));

// A deliberate entry gesture starts audio without relying on blocked autoplay.
const loader = document.querySelector('.experience-loader');
const enterButton = document.querySelector('.loader-enter');
const loaderSound = document.querySelector('.loader-sound');
const chrome = [...document.querySelectorAll('main, .skip-link, .corner-mark, .corner-nav, .social-rail, .menu-button, .music-switch')];
chrome.forEach(element => element.inert = true);
let startWithMusic = true, entering = false, assetReady = false;
loaderSound.addEventListener('click', () => {
  startWithMusic = !startWithMusic;
  loaderSound.setAttribute('aria-pressed', String(startWithMusic));
  loaderSound.setAttribute('aria-label', startWithMusic ? 'Start with music enabled' : 'Start with music disabled');
  loaderSound.querySelector('span').textContent = startWithMusic ? 'ON' : 'OFF';
});
const loaderStart = performance.now();
const videoReady = new Promise(resolve => {
  if (heroVideo.readyState >= 2) return resolve();
  heroVideo.addEventListener('loadeddata', resolve, {once:true});
  heroVideo.addEventListener('error', resolve, {once:true});
  setTimeout(resolve, 5000);
});
Promise.all([videoReady, document.fonts.ready]).then(() => { assetReady = true; });
function updateLoading(now) {
  const elapsed = now - loaderStart;
  const progress = assetReady && elapsed > 1300 ? 100 : Math.min(94, Math.floor(94 * (1 - Math.exp(-elapsed / 650))));
  loader.style.setProperty('--load-progress', progress / 100);
  const count = document.querySelector('.loader-count');
  if (count.textContent !== progress + '%') count.textContent = progress + '%';
  if (progress === 100) {
    loader.classList.add('ready'); enterButton.disabled = false;
    loader.querySelector('h2 em').textContent = 'START HERE.';
    document.querySelector('.loader-eyebrow').textContent = 'READY WHEN YOU ARE.';
    enterButton.focus({preventScroll:true});
  } else requestAnimationFrame(updateLoading);
}
requestAnimationFrame(updateLoading);
enterButton.addEventListener('click', event => {
  if (entering) return;
  entering = true;
  window.scrollTo({top:0,left:0,behavior:'instant'});
  loader.style.setProperty('--wipe-scale', Math.ceil(Math.hypot(innerWidth, innerHeight) / 20) + 2);
  setMusic(startWithMusic);
  if (motionEnabled) heroVideo.play().catch(() => {});
  loader.classList.add('entering');
  document.body.classList.add('experience-ready');
  setTimeout(() => {
    loader.hidden = true;
    document.body.classList.remove('is-loading');
    chrome.forEach(element => element.inert = false);
    window.scrollTo({top:0,left:0,behavior:'instant'});
    if (event.detail === 0) document.querySelector('.corner-mark').focus({preventScroll:true});
    queueMirror();
  }, motionEnabled ? 1000 : 0);
});
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && motionEnabled && document.body.classList.contains('experience-ready') && !document.hidden) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  });
}, {threshold:0.05});
videoObserver.observe(heroVideo);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) heroVideo.pause();
  else if (motionEnabled && heroVideo.getBoundingClientRect().bottom > 0 && document.body.classList.contains('experience-ready')) heroVideo.play().catch(() => {});
});

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'CLOSE −' : 'MENU +';
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('#page-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

let lastProjectButton = null;
main.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const data = projectData.find(project => project.id === button.dataset.project);
  if (!data) return;
  if (data.page) { window.location.assign(data.page); return; }
  lastProjectButton = button;
  document.getElementById('dialog-title').textContent = data.title;
  document.getElementById('dialog-category').textContent = data.category;
  document.getElementById('dialog-description').textContent = data.desc;
  document.getElementById('dialog-image').src = 'assets/' + data.image;
  document.getElementById('dialog-image').alt = data.title + ' project cover';
  const projectLink = document.getElementById('dialog-link');
  projectLink.hidden = !data.url;
  if (data.url) { projectLink.href = data.url; projectLink.textContent = data.linkLabel || 'VIEW FULL PROJECT ON BEHANCE ↗'; }
  else projectLink.removeAttribute('href');
  releaseIcon();
  document.body.classList.remove('pointer-present', 'keyboard-reveal');
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => { if (lastProjectButton) lastProjectButton.focus(); });

const videoData = [{"id": "Ydcd7Dm3ljE", "title": "Evergrain | Reducing Post Harvest Food Loss"}, {"id": "8DHsq4Fx6zo", "title": "Seeds Of Growth: Seeds that shape the good food economy | FarMart"}, {"id": "Yn1Strm_0Qk", "title": "Meet The Good Food Economy! #TheGoodFoodEconomy"}, {"id": "xKdDLsibZzY", "title": "Pee Safe Women's Day video - The first women's day aver"}, {"id": "FMqbaI166fY", "title": "RAHO SAFE SANITARY PADS FILM"}, {"id": "tOJv7Vh46k4", "title": "Stay comfy even on your periods, with superior quality pads from LAIQA | #GoodForHer | #GoodForEarth"}];
function showProject(index) {
 showcaseIndex = (index + videoData.length) % videoData.length;
 const video = videoData[showcaseIndex];
 const stage = main.querySelector('.video-stage');
 stage.replaceChildren();
 const button = document.createElement('button'); button.type = 'button'; button.className = 'video-poster'; button.setAttribute('aria-label','Play ' + video.title);
 const image = document.createElement('img'); image.src = 'https://i.ytimg.com/vi/' + video.id + '/hqdefault.jpg'; image.alt = video.title;
 const icon = document.createElement('span'); icon.className='video-play-icon'; icon.setAttribute('aria-hidden','true'); icon.textContent='▶';
 button.append(image,icon); stage.append(button);
 button.addEventListener('click',playFeaturedVideo);
 document.getElementById('showcase-title').textContent = video.title;
 document.getElementById('video-youtube').href = 'https://www.youtube.com/watch?v=' + video.id;
 main.querySelector('.showcase-count').textContent = String(showcaseIndex+1).padStart(2,'0') + ' / ' + String(videoData.length).padStart(2,'0');
 main.querySelectorAll('[data-video-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.videoIndex)===showcaseIndex)));
 main.querySelector('.video-announcement').textContent=video.title + ' selected.';
 queueMirror();
}
function playFeaturedVideo() {
 const video=videoData[showcaseIndex];
 const frame=document.createElement('iframe');
 frame.src='https://www.youtube-nocookie.com/embed/'+video.id+'?autoplay=1&rel=0';
 frame.title=video.title; frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.allowFullscreen=true; frame.referrerPolicy='strict-origin-when-cross-origin';
 main.querySelector('.video-stage').replaceChildren(frame);
 queueMirror();
}
function stopShowcase() { if(main.querySelector('.video-stage iframe')) showProject(showcaseIndex); }
main.querySelector('.video-poster').addEventListener('click',playFeaturedVideo);
main.querySelectorAll('[data-showcase-step]').forEach(b=>b.addEventListener('click',()=>showProject(showcaseIndex+Number(b.dataset.showcaseStep))));
main.querySelectorAll('[data-video-index]').forEach(b=>b.addEventListener('click',()=>showProject(Number(b.dataset.videoIndex))));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopShowcase();});


function selectTestimonial(index, announce=true) {
 if(index===activeTestimonial)return;
 activeTestimonial=index; const item=testimonials[index];
 const quote=main.querySelector('.testimonial-quote'); const mark=document.createElement('span');mark.className='testimonial-quotation';mark.textContent='“';quote.replaceChildren(mark,document.createTextNode(item.quote.slice(1)));const alternate=document.createElement('div');const alternateMark=mark.cloneNode(true);alternate.append(alternateMark,document.createTextNode(item.alternate.slice(1)));quote.dataset.alt=alternate.innerHTML;
 delete quote.dataset.wordsPrepared;animatedText=animatedText.filter(entry=>entry.element!==quote);prepareTextReveal(quote);updateTextReveal();
 main.querySelector('#testimonial-name').textContent=item.name;
 main.querySelector('#testimonial-role').textContent=item.role;
 main.querySelector('#testimonial-tagline').textContent=item.tagline;
 main.querySelectorAll('[data-testimonial]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.testimonial)===index)));
 if(announce)main.querySelector('.testimonial-announcement').textContent=item.name+': '+item.quote;
 const content=main.querySelector('.testimonial-content');content.classList.remove('changing');
 if(motionEnabled){void content.offsetWidth;content.classList.add('changing');}
 queueMirror();
}
function syncTestimonialScroll(){
 const section=main.querySelector('#testimonials');const sticky=section.querySelector('.testimonial-sticky');
 const bounds=section.getBoundingClientRect();const travel=section.offsetHeight-innerHeight;
 if(travel>0 && performance.now()>testimonialManualUntil){
  const progress=Math.max(0,Math.min(1,-bounds.top/travel));
  selectTestimonial(Math.min(2,Math.floor(progress*3)),false);
 }
 const mirrored=mirror.querySelector('.testimonial-sticky');
 if(mirrored){mirrored.style.top=(sticky.getBoundingClientRect().top-mirrored.parentElement.getBoundingClientRect().top)+'px';}
}
main.querySelectorAll('[data-testimonial]').forEach(button=>button.addEventListener('click',()=>{
 const index=Number(button.dataset.testimonial);testimonialManualUntil=performance.now()+1500;selectTestimonial(index);
 const section=main.querySelector('#testimonials');const travel=section.offsetHeight-innerHeight;
 easeTo(section.getBoundingClientRect().top+scrollY+travel*(index+.35)/3);
}));
const videoStrip = main.querySelector('.video-selections');
main.querySelectorAll('[data-video-slide]').forEach(button=>button.addEventListener('click',()=>{videoStrip.scrollBy({left:Number(button.dataset.videoSlide)*videoStrip.clientWidth*.8,behavior:motionEnabled?'smooth':'instant'});}));
videoStrip.addEventListener('wheel',event=>{
 if(Math.abs(event.deltaX)>=Math.abs(event.deltaY)||event.ctrlKey||event.metaKey)return;
 const direction=Math.sign(event.deltaY);
 if((direction<0&&videoStrip.scrollLeft<=1)||(direction>0&&videoStrip.scrollLeft+videoStrip.clientWidth>=videoStrip.scrollWidth-1))return;
 event.preventDefault();event.stopPropagation();videoStrip.scrollLeft+=event.deltaY;
},{passive:false});
videoStrip.addEventListener('keydown',event=>{
 if(!event.target.matches('[data-video-index]')||!['ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault();const buttons=[...videoStrip.querySelectorAll('button')];const i=buttons.indexOf(event.target);const next=buttons[(i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length];next.focus({preventScroll:true});next.scrollIntoView({behavior:motionEnabled?'smooth':'instant',block:'nearest',inline:'center'});
});
document.getElementById('year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  if (motionEnabled) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    main.querySelectorAll('.skill-row, .history-row, .work-row, .testimonial-layout').forEach(element => { element.classList.add('revealing'); revealObserver.observe(element); });
  }
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const section = entry.target.id;
    document.querySelectorAll('#page-nav a').forEach(link => { const selected = link.getAttribute('href') === '#' + section; link.classList.toggle('active', selected); if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }), { rootMargin: '-15% 0px -65% 0px' });
  ['about', 'work', 'contact'].forEach(id => navObserver.observe(document.getElementById(id)));
}
queueMirror();

// Synchronize the reveal once intrinsic image and font sizes have settled.
main.querySelectorAll('img').forEach(img => img.addEventListener('load', queueMirror));
document.fonts.ready.then(queueMirror);

// The profile mark always restarts the complete entry experience.
document.querySelector('.corner-mark').addEventListener('click', event => {
  event.preventDefault();
  window.location.reload();
});

// Preserve one typographic grid for both About versions, without clipping copy.
function reserveAboutSpace() {
  main.querySelectorAll('.about-copy, .experience-copy, .work-copy, .testimonial-quote, .contact-title').forEach(paragraph => {
  const style = getComputedStyle(paragraph);
  const probe = document.createElement('div');
  ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing'].forEach(key => probe.style[key] = style[key]);
  Object.assign(probe.style,{position:'absolute',left:'-10000px',top:'0',visibility:'hidden',width:paragraph.getBoundingClientRect().width+'px',margin:'0',padding:'0'});
  document.body.append(probe);
  probe.textContent = paragraph.matches('.testimonial-quote')?paragraph.textContent.replace(/^“/,''):paragraph.textContent; const defaultHeight = probe.getBoundingClientRect().height;
  probe.textContent = paragraph.matches('.testimonial-quote')?plainAlternate(paragraph).replace(/^“/,''):plainAlternate(paragraph); const hoverHeight = probe.getBoundingClientRect().height;
  let reservedHeight=Math.max(defaultHeight,hoverHeight);
  if(paragraph.matches('.testimonial-quote'))testimonials.forEach(item=>{[item.quote,item.alternate].forEach(text=>{probe.textContent=text.replace(/^“/,'');reservedHeight=Math.max(reservedHeight,probe.getBoundingClientRect().height);});});
  paragraph.style.minHeight = (Math.ceil(reservedHeight) + 4) + 'px';
  probe.remove();
  });
}
function updateTextReveal() {
  animatedText.forEach(({element,words}) => {
    const top = element.getBoundingClientRect().top;
    const progress = !motionEnabled ? 1 : Math.max(0, Math.min(1, (innerHeight*.9-top)/(innerHeight*.65)));
    words.forEach((word,index) => {
      const fill = Math.max(0, Math.min(1, progress*(words.length+4)-index));
      word.style.opacity = String(.25 + .75*fill);
    });
  });
}
function prepareTextReveal(element) {
  if (element.dataset.wordsPrepared) return;
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    (node.textContent.match(/\S+|\s+/g)||[]).forEach(piece => {
      if (/^\s+$/.test(piece)) fragment.append(document.createTextNode(piece));
      else { const word = document.createElement('span'); word.className = 'scroll-word'; word.textContent = piece; fragment.append(word); }
    });
    node.replaceWith(fragment);
  });
  element.dataset.wordsPrepared = 'true';
  animatedText.push({element,words:[...element.querySelectorAll('.scroll-word')]});
}
main.querySelectorAll('.statement, .motto h2, .contact-title, .testimonial-quote').forEach(prepareTextReveal);
updateTextReveal();
queueMirror();
heroVideo.playbackRate = .75;

// Ease desktop wheel input and section navigation while keeping native touch scrolling.
let smoothFrame = null, scrollTarget = window.scrollY, scrollLastTime = 0;
function stopSmoothScroll() {
  if (smoothFrame !== null) cancelAnimationFrame(smoothFrame);
  smoothFrame = null; scrollLastTime = 0; scrollTarget = window.scrollY;
}
function scrollLimit() { return Math.max(0, document.documentElement.scrollHeight-innerHeight); }
function animateSmoothScroll(time) {
  const dt = scrollLastTime ? Math.min(50,time-scrollLastTime) : 16.67;
  scrollLastTime = time;
  scrollTarget = Math.max(0, Math.min(scrollTarget, scrollLimit()));
  const next = window.scrollY+(scrollTarget-window.scrollY)*(1-Math.exp(-dt/170));
  window.scrollTo({top:next,behavior:'instant'});
  syncScroll();
  if (Math.abs(scrollTarget-window.scrollY)>1.5 && motionEnabled) smoothFrame=requestAnimationFrame(animateSmoothScroll);
  else { window.scrollTo({top:scrollTarget,behavior:'instant'}); syncScroll(); smoothFrame=null; scrollLastTime=0; }
}
function easeTo(position) {
  if (!motionEnabled) { window.scrollTo({top:position,behavior:'instant'}); return; }
  if (smoothFrame===null) scrollTarget=window.scrollY;
  scrollTarget=Math.max(0,Math.min(position,scrollLimit()));
  if (smoothFrame===null) smoothFrame=requestAnimationFrame(animateSmoothScroll);
}
window.addEventListener('wheel',event=>{
  if (!finePointer || !motionEnabled || event.ctrlKey || event.metaKey || dialog.open || document.body.classList.contains('is-loading') || event.target.closest('dialog,input,textarea,select') || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
  event.preventDefault();
  if (smoothFrame===null) scrollTarget=window.scrollY;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  easeTo(scrollTarget+delta*.75);
},{passive:false});
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  if (link.closest('.reveal-mirror') || link.classList.contains('skip-link')) return;
  link.addEventListener('click',event=>{
    const target=document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    history.pushState(null,'',link.getAttribute('href'));
    easeTo(target.getBoundingClientRect().top+window.scrollY-80);
  });
});
['touchstart','pointerdown'].forEach(name=>window.addEventListener(name,stopSmoothScroll,{passive:true}));
window.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))stopSmoothScroll();});
prefersReduced.addEventListener('change',()=>{stopSmoothScroll();updateTextReveal();});

// Keep all desktop expertise titles on one shared size that fits the longest line.
function fitExpertiseTitles() {
  const section=main.querySelector('#skills');
  if (!section) return;
  section.style.removeProperty('--expertise-size');
  if (innerWidth<=650) return;
  const headings=[...section.querySelectorAll('.skill-row h2')];
  const style=getComputedStyle(headings[0]);
  const preferred=parseFloat(style.fontSize);
  const probe=document.createElement('span');
  Object.assign(probe.style,{position:'absolute',left:'-10000px',visibility:'hidden',whiteSpace:'nowrap',fontFamily:style.fontFamily,fontWeight:style.fontWeight,fontSize:style.fontSize,letterSpacing:style.letterSpacing});
  document.body.append(probe);
  let fitted=preferred;
  headings.forEach(heading=>{
    probe.textContent=heading.textContent.toUpperCase();
    const width=probe.getBoundingClientRect().width;
    if (width>0) fitted=Math.min(fitted,preferred*heading.clientWidth/width);
  });
  probe.remove();
  section.style.setProperty('--expertise-size',Math.floor(fitted*2)/2+'px');
}

// Select a preview without opening it; the featured project opens the detail view.
const wheelFeature = main.querySelector('.wheel-feature');
const wheelChoices = [...main.querySelectorAll('[data-wheel-project]')];
let wheelAnimationTimer;
wheelChoices.forEach(choice => choice.addEventListener('click', () => {
  const project = projectData.find(item => item.id === choice.dataset.wheelProject);
  if (!project || wheelFeature.dataset.project === project.id) return;
  wheelChoices.forEach(item => item.setAttribute('aria-pressed', String(item === choice)));
  wheelFeature.dataset.project = project.id;
  wheelFeature.setAttribute('aria-label', 'Explore ' + project.title + ' project');
  const image = wheelFeature.querySelector('img');
  image.src = 'assets/' + project.image; image.alt = project.title + ' project cover';
  wheelFeature.querySelector('.wheel-feature-title').textContent = project.title.toUpperCase();
  wheelFeature.querySelector('.wheel-feature-category').textContent = project.category;
  wheelFeature.querySelector('.wheel-feature-category').hidden = !project.category;
  wheelFeature.querySelector('.wheel-feature-open').textContent = project.page ? (project.action || 'EXPLORE PROJECT ↗') : project.url ? 'EXPLORE PROJECT ↗' : 'ABOUT AI VIDEO ↗';
  main.querySelector('.wheel-announcement').textContent = project.title + ' selected. Explore project to open details.';
  clearTimeout(wheelAnimationTimer);
  wheelFeature.classList.remove('changing');
  if (motionEnabled) { void wheelFeature.offsetWidth; wheelFeature.classList.add('changing'); wheelAnimationTimer = setTimeout(() => wheelFeature.classList.remove('changing'), 600); }
  queueMirror();
}));

// Wheel motion runs only while the section is visible, and respects reduced motion.
const projectWheel = main.querySelector('.project-wheel');
const wheelObserver = new IntersectionObserver(entries => entries.forEach(entry => projectWheel.classList.toggle('wheel-active',entry.isIntersecting)), {threshold:.1});
wheelObserver.observe(projectWheel);
main.querySelectorAll('[data-wheel-step]').forEach(button => button.addEventListener('click',()=>{
 const current=wheelChoices.findIndex(choice=>choice.getAttribute('aria-pressed')==='true');
 wheelChoices[(current+Number(button.dataset.wheelStep)+wheelChoices.length)%wheelChoices.length].click();
}));
projectWheel.addEventListener('keydown',event=>{
 if(!event.target.matches('.wheel-choice') || !['ArrowLeft','ArrowRight'].includes(event.key))return;
 event.preventDefault(); const current=wheelChoices.indexOf(event.target);
 const next=wheelChoices[(current+(event.key==='ArrowRight'?1:-1)+wheelChoices.length)%wheelChoices.length]; next.focus({preventScroll:true}); next.click();
});
if(finePointer){wheelFeature.addEventListener('pointermove',event=>{if(!motionEnabled)return;const r=wheelFeature.getBoundingClientRect();wheelFeature.style.setProperty('--tilt-x',((event.clientY-r.top)/r.height-.5)*-7+'deg');wheelFeature.style.setProperty('--tilt-y',((event.clientX-r.left)/r.width-.5)*7+'deg');});wheelFeature.addEventListener('pointerleave',()=>{wheelFeature.style.setProperty('--tilt-x','0deg');wheelFeature.style.setProperty('--tilt-y','0deg');});}

// Decorative design-rule footage plays only while visible; no sound or controls.
const mottoVideo=main.querySelector('.motto-video');
function syncMottoVideo(){const r=mottoVideo.getBoundingClientRect();if(motionEnabled&&!document.hidden&&document.body.classList.contains('experience-ready')&&r.bottom>0&&r.top<innerHeight)mottoVideo.play().catch(()=>{});else mottoVideo.pause();}
new IntersectionObserver(syncMottoVideo,{threshold:.05}).observe(mottoVideo);
prefersReduced.addEventListener('change',syncMottoVideo);
document.addEventListener('visibilitychange',syncMottoVideo);
