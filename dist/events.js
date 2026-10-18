const galleries = {"dashak": [["dashak-stage", "The anniversary stage and circular stage-front branding, ready for Dashak."], ["dashak-identity", "Dashak\u2019s tenth-anniversary identity carried into a freestanding venue display."], ["dashak-impact", "Printed impact-pillar and anniversary displays at the venue."], ["dashak-live", "The Dashak stage and venue branding during the anniversary celebration."]], "aahar": [["aahar-stall", "A wide view of FarMart\u2019s branded stall at Aahar 2025."], ["aahar-display", "Product display, stall fascia and printed graphics at Aahar 2025."], ["aahar-interactive", "An interactive branded display at the FarMart stall."], ["aahar-team", "The FarMart team engaging with visitors at the stall."]], "jaipur": [["jaipur-stage", "Synergy Summit 2024 stage graphics at the Jaipur annual offsite."], ["jaipur-awards", "Recognition and award presentation graphics at the Jaipur offsite."], ["jaipur-team", "FarMart colleagues taking part in an offsite team activity in Jaipur."]], "hyderabad": [["hyderabad-entry", "Branded event entrance at the Hyderabad annual offsite."], ["hyderabad-backdrop", "FarMart\u2019s repeated brand backdrop and printed event lanyards in Hyderabad."], ["hyderabad-team", "The FarMart team gathering around the offsite venue branding in Hyderabad."]]};
const lightbox=document.getElementById('event-lightbox');
const lightboxImage=document.getElementById('lightbox-image');
let group='dashak',index=0,lastImageButton=null;
function updateLightbox(){const items=galleries[group];index=(index+items.length)%items.length;const [name,caption]=items[index];lightboxImage.src='/assets/events/'+name+'.webp';lightboxImage.alt=caption;document.getElementById('lightbox-caption').textContent=caption;document.getElementById('lightbox-count').textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{lastImageButton=button;group=button.dataset.gallery;index=Number(button.dataset.image);updateLightbox();lightbox.showModal();document.body.classList.add('lightbox-open');}));
document.getElementById('lightbox-close').addEventListener('click',()=>lightbox.close());
document.getElementById('lightbox-prev').addEventListener('click',()=>{index--;updateLightbox();});
document.getElementById('lightbox-next').addEventListener('click',()=>{index++;updateLightbox();});
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();index+=event.key==='ArrowRight'?1:-1;updateLightbox();}});
lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
lightbox.addEventListener('close',()=>{document.body.classList.remove('lightbox-open');if(lastImageButton)lastImageButton.focus({preventScroll:true});});
const links=[...document.querySelectorAll('.event-nav a')];
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-10% 0px -65% 0px'});
 document.querySelectorAll('.event-story').forEach(section=>observer.observe(section));
}
document.getElementById('year').textContent=new Date().getFullYear();
