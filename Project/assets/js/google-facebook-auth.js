
var userData = {};

function google_auth(){

    var google_provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(google_provider).then(function(result){



        var token = result.credential.accesToken;

        var user = result.user;


        var email = user.email;
        var first_name = user.displayName.split(" ")[0];
        var last_name = user.displayName.split(" ")[1];
        var uid = user.uid;
        var photo_url = user.photoURL;

        console.log(user);

        userData = {

            first_name: first_name,

            last_name: last_name,

            country: "Not Defined",

            photo_url: photo_url,

            email: email,

            role: "user",

            created_at: new Date().toDateString(),

            stats: {

                level:{

                    color: 'grey'
                },
                //
                // per_day:{
                //     day : 1,
                //     number_of_letters_drawn: 0
                // },
                //
                // per_week:{
                //     week: 1,
                //     number_of_tries: 0,
                //     number_of_successes: 0
                // }


            }

        };

        saveUserData(uid,userData);

    }).catch(function(error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        console.log(errorMessage);
    });
}

function facebook_auth(){

    var facebook_provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(facebook_provider).then(function(result){



        var token = result.credential.accesToken;

        var user = result.user;


        var email = user.email;
        var first_name = user.displayName.split(" ")[0];
        var last_name = user.displayName.split(" ")[1];
        var uid = user.uid;
        var photo_url = user.photoURL;

        console.log(user);

        userData = {

            first_name: first_name,

            last_name: last_name,

            country: "Not Defined",

            photo_url: photo_url,

            email: email,

            role: "user",

            created_at: new Date().toDateString(),

            stats: {

                level:{

                    color: 'grey'
                },

                // per_day:{
                //     day : 1,
                //     number_of_letters_drawn: 0
                // },
                //
                // per_week:{
                //     week: 1,
                //     number_of_tries: 0,
                //     number_of_successes: 0
                // }


            }

        };

        saveUserData(uid,userData);

    }).catch(function(error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        console.log(errorMessage);
    });
}

function saveUserData(userId,userData){
    firebase.database().ref('users/'+userId).set(userData)

        .then(function onSuccess(res){

            window.location.href = './ListOfLessons.html';

        }).catch(function onError(err){

        rf_error_message.innerHTML = err.message;

    });
}
