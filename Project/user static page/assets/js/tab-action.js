var aboutTab = document.getElementById("tab1");
var statsTab = document.getElementById("tab2");


function switchToAbout(){
    switchTabs(statsTab,aboutTab);
}

function switchToStats(){
    switchTabs(aboutTab,statsTab);
    initialize();
}

function switchTabs(current_tab,requested_tab){
    current_tab.classList.add('hidden');
    fadeOut(current_tab);
    fadeIn(requested_tab);
    requested_tab.classList.remove('hidden');
}

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};