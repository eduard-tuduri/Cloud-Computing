document.addEventListener('DOMContentLoaded', function (){
        if (window.innerWidth <= 650){
            rotate_phone();
        }
    }, false);

function rotate_phone() {
    document.getElementById('rt').classList.add('rotate');
}

window.addEventListener('resize', function() {
    if (window.innerWidth <= 650) {
        rotate_phone();
    }
}, false);