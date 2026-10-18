const films = [
 {title:'Raw Peanuts',brand:'Truly Safe',slug:'raw-peanuts',duration:'00:18',note:'A little everyday warmth. A lot of storytelling.'},
 {title:'Rice',brand:'Sugar Watchers',slug:'sugar-watchers-rice',duration:'00:12',note:'A product story, brought to life one frame at a time.'},
 {title:'Atta',brand:'Sugar Watchers',slug:'sugar-watchers-atta',duration:'00:15',note:'From the everyday kitchen to a new visual world.'},
 {title:'Yellow Moong',brand:'Truly Safe',slug:'ts-ai-ad',duration:'00:28',note:'Familiar rituals. A fresh way to tell the story.'}
];
const player=document.getElementById('film-player');
const cards=[...document.querySelectorAll('[data-film]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let current=0;
function selectFilm(index,shouldPlay=true){
 current=(index+films.length)%films.length;
 const film=films[current];
 player.pause();player.poster='/assets/ai-films/'+film.slug+'.jpg';
 player.src='/assets/ai-films/'+film.slug+'.mp4';player.setAttribute('aria-label',film.brand+' — '+film.title);player.load();
 document.getElementById('film-brand').textContent=film.brand.toUpperCase()+' / AI BRAND FILM';
 document.getElementById('film-title').textContent=film.title;
 document.getElementById('film-note').textContent=film.note;
 document.getElementById('film-count').textContent=String(current+1).padStart(2,'0')+' / 04';
 document.getElementById('film-duration').textContent=film.duration;
 document.getElementById('direct-film').href=player.src;
 document.getElementById('playback-error').hidden=true;
 cards.forEach((card,i)=>{card.setAttribute('aria-pressed',String(i===current));card.querySelector('.card-state').textContent=i===current?'NOW SHOWING':'';});
 document.getElementById('film-announcement').textContent=film.brand+' — '+film.title+' selected.';
 if(shouldPlay)player.play().catch(()=>{});
 document.getElementById('screening').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
}
cards.forEach(card=>card.addEventListener('click',()=>selectFilm(Number(card.dataset.film))));
document.getElementById('previous-film').addEventListener('click',()=>selectFilm(current-1));
document.getElementById('next-film').addEventListener('click',()=>selectFilm(current+1));
player.addEventListener('error',()=>{document.getElementById('playback-error').hidden=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)player.pause();});
document.getElementById('year').textContent=new Date().getFullYear();
