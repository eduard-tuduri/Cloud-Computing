// FISIER FACUT PENTRU GESTIONAREA DATELOR DIN BAZA DE DATE FIREBASE IMPREUNA CU PAGINA DE PREZENTARE HTML

// handler pentru butonul de logout
function logout(){
    firebase.auth().signOut().then(function(){

        window.location='../Start.hmtl';

    }).catch(function(error){
        console.log(error.message);
    });
}



firebase.auth().onAuthStateChanged(onAuthStateChange);


//functie ce verifica starea utilizatorului
function onAuthStateChange(user) {
    if (user) {

        // in caz ca este logat

        var email = user.email;
        var userId = user.uid;
        user_uid = userId;

        // vom face apel la baza de date pentru a prelua datele despre acesta

        firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            document.getElementById('username').innerText = snapshot.val().first_name + ' ' + snapshot.val().last_name;
            renderDbValuesToHtml(snapshot.val());
            user_stats = snapshot.val().stats;

        });
    }
    else
        {
            // in cazul in care iese din aplicatie, va fi redirectionat la pagina de start

            window.location = '../Start.html';
        }
}


// functie ce randeaza informatiile din baza de date a utilizatorului curent in pagina HTML (folosind Mustache.js)

function renderDbValuesToHtml(jsonObj){



    // pentru tab-ul "Your details"

    var output = Mustache.render("<h5>First name: <span> {{first_name}}</span></h5>\n" +
        "                                                    <h5>Last name: <span> {{last_name}}</span></h5>\n" +
        "                                                    <h5>Country: <span> {{country}}</span></h5>\n" +
        "                                                    <h5>Registered at: <span> {{created_at}}</span></h5>\n"

        , jsonObj );

    document.getElementById('user-info').innerHTML = output;


    // Pentru numele de sub poza de profil din header
    document.getElementById('header-name').innerHTML = Mustache.render("{{first_name}} {{last_name}}",jsonObj);


    // pentru culoarea nivelului (kimono + titlu) vom apela functia din level-of-belt-action.js
    setLevelColorForKimonoAndTitle(jsonObj.stats.level.color);

    // pentru header si poza de profil

    document.getElementById('photo_bg').setAttribute('src',jsonObj.photo_url);
    document.getElementById('pht_avtr').setAttribute('src',jsonObj.photo_url);

}





// functie pentru upload-ul unei poze noi de profil pentru un utilizator

var upload_elem = document.getElementById('image-upload');

upload_elem.addEventListener('change',function(e) {

    var file = e.target.files[0];


    // verificam daca fisierul este de tip imagine
    var ValidImageTypes = ["image/gif", "image/jpeg", "image/png","image/jpg","image/bmp"];
    if(ValidImageTypes.indexOf(file.type) == -1){
        alert("Your uploaded file is not a picture!")
        return;
    }


    var storageRef = firebase.storage().ref('img/' + file.name);

    storageRef.put(file).then(function (snapshot) {


        firebase.database().ref('users/' + user_uid).update({

            photo_url: snapshot.downloadURL

        }).then(function(res){

            document.location.reload(true);

        });
    }).catch(function(error){

        alert(error.message);

    });
});