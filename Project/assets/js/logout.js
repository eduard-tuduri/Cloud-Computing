// handler pentru butonul de logout
function logout() {
    firebase.auth().signOut().then(function () {

        window.location = 'Start.html';

    }).catch(function (error) {
        console.log(error.message);
    });
}

//functie ce verifica starea utilizatorului
function onAuthStateChange(user) {
    if (user) {

        // in caz ca este logat

        let userId = user.uid;
        user_uid = userId;

        // vom face apel la baza de date pentru a prelua datele despre acesta

        firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            document.getElementById('username').innerText = snapshot.val().first_name + ' ' + snapshot.val().last_name;
            // Init();
        });
    }
    else {
        // in cazul in care iese din aplicatie, va fi redirectionat la pagina de start

        window.location = 'Start.html';
    }
}

firebase.auth().onAuthStateChanged(onAuthStateChange);