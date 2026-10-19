const ads=[{"brand": "Pee Safe", "title": "One less seat to worry about.", "description": "A travel-led print ad that uses an aircraft as the visual hook, with the product and headline doing the rest.", "category": "Travel & hygiene", "tone": "#a7bdc8", "src": "/assets/magazine/ad-01.webp", "width": 676, "height": 910}, {"brand": "Pee Safe", "title": "Everyday care, clearly framed.", "description": "A product-led composition that brings everyday surface hygiene into focus through a direct headline and a restrained visual palette.", "category": "Product advertising", "tone": "#68675f", "src": "/assets/magazine/ad-02.webp", "width": 676, "height": 910}, {"brand": "Raho Safe", "title": "Comfort, front and centre.", "description": "A period-care layout that balances a portrait, product range and a clear purple brand language.", "category": "Period care", "tone": "#cdb2df", "src": "/assets/magazine/ad-03.webp", "width": 493, "height": 664}, {"brand": "Pee Safe", "title": "A different period conversation.", "description": "A clean composition for menstrual-cup communication, giving the headline, product and portrait their own space.", "category": "Period care", "tone": "#e0c7d6", "src": "/assets/magazine/ad-04.webp", "width": 493, "height": 664}, {"brand": "Pee Safe", "title": "The freedom to be yourself.", "description": "An expressive portrait brings energy to a wider personal-care range, supported by a clear product and information hierarchy.", "category": "Personal care", "tone": "#c2cb8b", "src": "/assets/magazine/ad-05.webp", "width": 493, "height": 664}, {"brand": "Pee Safe", "title": "Don’t whisper it.", "description": "A bold, message-led layout that puts the campaign’s voice first, using warm colour and a strong headline to hold attention.", "category": "Campaign communication", "tone": "#d38b7a", "src": "/assets/magazine/ad-06.webp", "width": 493, "height": 664}, {"brand": "Pee Safe", "title": "A local voice. A familiar identity.", "description": "Gujarati-language communication keeps the product and brand recognisable while speaking directly to a regional audience.", "category": "Regional communication", "tone": "#a2ccd1", "src": "/assets/magazine/ad-07.webp", "width": 493, "height": 664}, {"brand": "Domina", "title": "Change the narrative.", "description": "A group portrait and product-led layout bring the Domina campaign into print, with purple accents connecting the visual story.", "category": "Sexual wellness", "tone": "#9e91aa", "src": "/assets/magazine/ad-08.webp", "width": 493, "height": 664}];
let currentAd=0,view='paper',returnFocus=null;
const reader=document.getElementById('print-reader'),dialog=document.getElementById('artwork-dialog');
const image=document.getElementById('ad-image');
function renderAd(index){
 currentAd=(index+ads.length)%ads.length;const ad=ads[currentAd];
 document.getElementById('ad-count').textContent=String(currentAd+1).padStart(2,'0')+' / 08';
 document.getElementById('ad-brand').textContent=ad.brand.toUpperCase();
 document.getElementById('ad-title').textContent=ad.title;
 document.getElementById('ad-description').textContent=ad.description;
 document.getElementById('ad-category').textContent=ad.category.toUpperCase();
 image.src=ad.src;image.alt=ad.brand+' — '+ad.title;image.width=ad.width;image.height=ad.height;
 document.getElementById('paper-stage').style.setProperty('--paper-tone',ad.tone);
 document.querySelectorAll('[data-ad]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.ad)===currentAd)));
 document.getElementById('reader-status').textContent='Advertisement '+(currentAd+1)+' of '+ads.length+'. '+ad.brand+'. '+ad.title;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)image.animate([{opacity:.2},{opacity:1}],{duration:350,easing:'ease-out'});
 if(dialog.open)renderEnlarged();
}
function renderEnlarged(){const ad=ads[currentAd];const enlarged=document.getElementById('artwork-image');enlarged.src=ad.src;enlarged.alt=ad.brand+' — '+ad.title;document.getElementById('artwork-label').textContent=ad.brand.toUpperCase()+' / '+String(currentAd+1).padStart(2,'0')+' OF 08';}
function enlarge(){returnFocus=document.activeElement;renderEnlarged();dialog.showModal();document.body.classList.add('artwork-open');}
document.getElementById('ad-prev').addEventListener('click',()=>renderAd(currentAd-1));
document.getElementById('ad-next').addEventListener('click',()=>renderAd(currentAd+1));
document.querySelectorAll('[data-ad]').forEach(button=>button.addEventListener('click',()=>renderAd(Number(button.dataset.ad))));
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{view=button.dataset.view;document.getElementById('paper-stage').classList.toggle('flat',view==='flat');document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));document.querySelector('.stage-note').textContent=view==='flat'?'FLAT ARTWORK':'PRINT PRESENTATION';}));
document.getElementById('ad-enlarge').addEventListener('click',enlarge);document.getElementById('view-artwork').addEventListener('click',enlarge);
document.getElementById('artwork-close').addEventListener('click',()=>dialog.close());
document.getElementById('artwork-prev').addEventListener('click',()=>renderAd(currentAd-1));document.getElementById('artwork-next').addEventListener('click',()=>renderAd(currentAd+1));
dialog.addEventListener('close',()=>{document.body.classList.remove('artwork-open');returnFocus?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function arrowNavigation(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();renderAd(currentAd+(e.key==='ArrowRight'?1:-1));}}
reader.addEventListener('keydown',arrowNavigation);dialog.addEventListener('keydown',arrowNavigation);
document.getElementById('year').textContent=new Date().getFullYear();renderAd(0);
