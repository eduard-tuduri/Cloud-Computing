var overlay = document.getElementById('overlay');

svg_success = `<svg class="svg-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <circle class="success_circle" cx="26" cy="26" r="25" fill="none" />
  <path class="success_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
</svg>`;

svg_fail = `<svg class="svg-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <circle class="fail_circle" cx="26" cy="26" r="25" fill="none" />
  <path class="fail_check" fill="none" d="M16 16 36 36 M36 16 16 36" />
</svg>`;

function openModal(){
	overlay.classList.remove("is-hidden");
	document.getElementsByClassName("navbar")[0].style.zIndex=0;
}

function closeModal(){
	overlay.classList.add("is-hidden");
	document.getElementsByClassName("navbar")[0].style.zIndex=1;
}