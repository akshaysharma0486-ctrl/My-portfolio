const films = [
 {title:'Raw Peanuts',brand:'Truly Safe',slug:'raw-peanuts',duration:'00:18',note:'A little everyday warmth. A lot of storytelling.'},
 {title:'Rice',brand:'Sugar Watchers',slug:'sugar-watchers-rice',duration:'00:12',note:'A product story, brought to life one frame at a time.'},
 {title:'Atta',brand:'Sugar Watchers',slug:'sugar-watchers-atta',duration:'00:15',note:'From the everyday kitchen to a new visual world.'},
 {title:'Yellow Moong',brand:'Truly Safe',slug:'ts-ai-ad',duration:'00:28',note:'Familiar rituals. A fresh way to tell the story.'},
 {"title": "Millet Noodles", "brand": "Sugar Watchers", "slug": "sugar-watchers-noodles", "duration": "00:15", "note": "Small chefs. Big appetite for imagination."},
 {"title": "Whole Moong", "brand": "Truly Safe", "slug": "truly-safe-moong-whole", "duration": "00:18", "note": "A familiar ingredient, in a different frame."},
 {"title": "Millet Dosa Mix", "brand": "Sugar Watchers", "slug": "sugar-watchers-dosa-mix", "duration": "00:14", "note": "An everyday breakfast, with a new visual twist."}
];
const player=document.getElementById('film-player');
const cards=[...document.querySelectorAll('[data-film]')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let current=0;
function selectFilm(index,shouldPlay=true){
 current=(index+films.length)%films.length;
 const film=films[current];
 stopTutorial();
 player.pause();player.poster='/assets/ai-films/'+film.slug+'.jpg';
 player.src='/assets/ai-films/'+film.slug+'.mp4';player.setAttribute('aria-label',film.brand+' — '+film.title);player.load();
 document.getElementById('film-brand').textContent=film.brand.toUpperCase()+' / AI AD';
 document.getElementById('film-title').textContent=film.title;
 document.getElementById('film-note').textContent=film.note;
 document.getElementById('film-count').textContent=String(current+1).padStart(2,'0')+' / '+String(films.length).padStart(2,'0');
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

const tutorials = [{"id": "gYOYjuFI5tE", "title": "गेहूँ सुखाने और ढुलाई का सही तरीका | अनाज का नुकसान कम करें | FarMart", "duration": "02:04"}, {"id": "LGIFlVgLLcE", "title": "धान कटाई की सही चेकलिस्ट | Paddy Harvesting Checklist | Post Harvest Loss", "duration": "01:16"}, {"id": "C0xGGPh12qk", "title": "गेहूँ कटाई की सही चेकलिस्ट | Wheat Harvesting Checklist | Post Harvest Loss", "duration": "01:26"}, {"id": "Cauh3mgpCfQ", "title": "गेहूं का सही भंडारण कैसे करें? | Wheat Storage Tips | Post Harvest Loss", "duration": "01:28"}, {"id": "KWjBsgO4ZGU", "title": "धान का सही भंडारण कैसे करें? | Hermetic Bag से अनाज बचाएं | Post Harvest Loss", "duration": "01:54"}, {"id": "5Di8VJ4s_oY", "title": "अनाज रखने में ये 3 गलतियाँ न करें | सही भंडारण का तरीका | EverGrain by FarMart", "duration": "01:03"}, {"id": "Rny60Y9GvuE", "title": "लगभग ₹250 प्रति क्विंटल ज़्यादा कमाएँ | FarMart", "duration": "01:40"}, {"id": "wMDOweNp3uM", "title": "कटाई शुरू, नुकसान भी शुरू? असली कहानी जानिए!", "duration": "01:16"}];
const tutorialStage=document.getElementById('tutorial-stage');
const tutorialChoices=[...document.querySelectorAll('[data-tutorial]')];
let tutorialIndex=0;
function showTutorialPoster(){
 const item=tutorials[tutorialIndex];
 const button=document.createElement('button');button.type='button';button.className='tutorial-poster';button.setAttribute('aria-label','Play tutorial: '+item.title);
 const image=document.createElement('img');image.src='https://i.ytimg.com/vi/'+item.id+'/hqdefault.jpg';image.alt=item.title;
 const icon=document.createElement('span');icon.textContent='▶';icon.setAttribute('aria-hidden','true');button.append(image,icon);button.addEventListener('click',()=>playTutorial(tutorialIndex));tutorialStage.replaceChildren(button);
}
function stopTutorial(){if(tutorialStage.querySelector('iframe'))showTutorialPoster();}
function playTutorial(index){
 tutorialIndex=index;player.pause();
 const item=tutorials[index];const frame=document.createElement('iframe');
 frame.src='https://www.youtube-nocookie.com/embed/'+item.id+'?autoplay=1&rel=0&list=PLOFQmdTXuX6Q';frame.title='EverGrain Tutorials — '+item.title;frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';tutorialStage.replaceChildren(frame);
 document.getElementById('tutorial-title').textContent=item.title;document.getElementById('tutorial-count').textContent=String(index+1).padStart(2,'0')+' / '+String(tutorials.length).padStart(2,'0');
 tutorialChoices.forEach((choice,i)=>choice.setAttribute('aria-pressed',String(i===index)));
 document.getElementById('tutorial-announcement').textContent='Tutorial '+(index+1)+' selected: '+item.title;
}
tutorialStage.querySelector('button').addEventListener('click',()=>playTutorial(tutorialIndex));
tutorialChoices.forEach(choice=>choice.addEventListener('click',()=>playTutorial(Number(choice.dataset.tutorial))));
player.addEventListener('play',stopTutorial);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTutorial();});
