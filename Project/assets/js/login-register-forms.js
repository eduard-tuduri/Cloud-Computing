/* PENTRU SCHIMBAREA FORMULARULUI REGISTER/LOGIN */

var login_form = document.getElementById("login_form");
var register_form = document.getElementById("register_form");

function switchToLogin() {

    register_form.classList.add('hidden');
    changeBetweenForms(register_form, login_form, fadeIn);
    login_form.classList.remove('hidden');
}

function switchToRegister() {
    login_form.classList.add('hidden');
    changeBetweenForms(login_form, register_form, fadeIn);
    register_form.classList.remove('hidden');


}

function changeBetweenForms(form_to_disappear, form_to_appear, callback) {

    fadeOut(form_to_disappear);
    callback(form_to_appear);


}


function fadeOut(el) {
    el.style.opacity = 1;

    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
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


/* --------------------------------------------------------- */








firebase.auth().onAuthStateChanged(onAuthStateChange);







/* REGISTER */

var rf = document.getElementById('rf');
var rf_error_message = document.getElementById('rf-error-message');

rf.addEventListener('submit', function (e) {

    rf_error_message.innerHTML="";

    e.preventDefault();

    var first_name = document.getElementById("r_first_name").value;
    var last_name = document.getElementById("r_last_name").value;
    var country = document.getElementById('r_country').value;
    var email = document.getElementById('r_email').value;
    var password = document.getElementById('r_password').value;
    var confirm_password = document.getElementById('r_password_confirm').value;

    if(password.localeCompare(confirm_password) !== 0){

        rf_error_message.innerHTML += 'Passwords do not match!';
    }

    else{

        createUser(first_name,last_name,country,email,password);
    }

    
});

var inCreatingUser = false;

var userData = {};

function createUser(first_name, last_name, country, email, password) {

    inCreatingUser = true;

    userData = {

        first_name: first_name,
        
        last_name: last_name,
        
        country: country,

        email: email,
        
        role: "user",

        photo_url: "https://firebasestorage.googleapis.com/v0/b/asle-a66d5.appspot.com/o/img%2Fuser-2517433_640.png?alt=media&token=fcd01355-e665-4394-b19f-e3982f3b9cac",

        created_at: new Date().toDateString(),

        stats: {

            level:{

                color: 'grey'
            },

            // per_day:[
            //     {
            //         date: new Date().toDateString(),
            //         score: 0,
            //         number_of_tries: 0,
            //         number_of_successes: 0
            //     },
            // ],

            /*lessons_progress:[
                lesson_id: {
                    number_of_drawn_letters: 2
                }
            ]*/
        }
    };

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {

        // Handle Errors here.

        var errorMessage = error.message;

        rf_error_message.innerHTML=errorMessage;

    });

}


function onAuthStateChange(user){
    if(user) {
        //User is signed in.
        var uid = user.uid;


        if (inCreatingUser) {
            inCreatingUser = false;
            saveUserData(uid, userData);
        }


    }
}

function saveUserData(userId,userData){
    firebase.database().ref('users/'+userId).set(userData)

        .then(function onSuccess(res){
            // window.location.href = './ListOfLessons.html';

        }).catch(function onError(err){

            rf_error_message.innerHTML = err.message;

        });
}

/* --------------------------------------------------------- */








// /* LOGIN */
firebase.auth().onAuthStateChanged(onAuthStateChange);

var lf = document.getElementById('lf');
var lf_error_message = document.getElementById('lf-error-message');

lf.addEventListener('submit', function (e) {

    e.preventDefault();

    lf_error_message.innerHTML="";
    var email = document.getElementById('l_email').value;
    var password = document.getElementById('l_password').value;

    login(email,password);

});

function login(email,password) {

    firebase.auth().signInWithEmailAndPassword(email,password)


        .then(function onSucces(res){

            if(email === "admin@asle.com"){
                window.location = 'admin-lesson-list.html';
            }
            else{
                window.location = 'ListOfLessons.html';
            }

        }). catch(function(error){

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        lf_error_message.innerHTML=errorMessage;

        });
}


/* --------------------------------------------------------- */
