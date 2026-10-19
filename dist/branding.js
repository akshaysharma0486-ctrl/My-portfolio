const projectIds=["big-dj-bash", "accelscale", "furr", "domina", "status-tag"];
function followProjectHash(){const id=location.hash.slice(1);if(projectIds.includes(id))location.replace("/branding/"+id+"/");}
window.addEventListener("hashchange",followProjectHash);followProjectHash();document.getElementById("year").textContent=new Date().getFullYear();
