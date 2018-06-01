dict = {};
var lessonTitle;
function Init() {
    var refFireBase = firebase.database().ref();
    refFireBase.on('value', gotData, errData);
}

function getId(event) {
    var lesson_name;
    if (typeof InstallTrigger !== 'undefined') { // test if we are on firefox
        lesson_name = event.originalTarget.childNodes[3].innerText;
    } else {
        for (var path of event.path) {
            if (path.className === 'row') {
                lesson_name = path.childNodes[3].innerText;
                break;
            }
        }
    }

    localStorage.setItem('lesson_title', dict[lesson_name]);
    window.location = 'Lesson.html';
}

function gotData(data) {
    document.getElementById('template').innerHTML = "";
    var db = data.val();
    keys = Object.keys(db.Lessons);
    iterator = 0;
    for (key of keys) {
        dict[db.Lessons[key].lesson_name] = key;
        iterator += 1;
        var Letters = "";
        for (letter of db.Lessons[key].letters) {
            Letters += " \"" + letter + " \" ";
        }

        var Progress;
        if (typeof user_data.stats.lessons_progress !== 'undefined') {
            console.log(Object.keys(user_data.stats.lessons_progress));
            if (Object.keys(user_data.stats.lessons_progress).indexOf(key) > -1) {
                console.log("yolo");
                Progress = 100 * (parseInt(user_data.stats.lessons_progress[key].number_of_letters_drawn) / parseInt(user_data.stats.lessons_progress[key].total_number_of_letters));
                console.log(parseInt(user_data.stats.lessons_progress[key].total_number_of_letters));
            } else {
                console.log("sunt in else");
                Progress = 0;
                console.log(Progress);
            }
        } else {
            console.log("sunt in else");
            Progress = 0;
            console.log(Progress);
        }

        var obj, template;
        obj = {
            name: key,
            letters: Letters,
            lesson_number: iterator,
            lesson_title: db.Lessons[key].lesson_name,
            progress: Progress
        };

        template = document.getElementById('lesson-list').innerHTML;
        var output = Mustache.render(template, obj);
        document.getElementById('template').innerHTML += output;
    }
}

function errData(err) {
    console.log("Error!");
}

function remove_lesson() {
    firebase.database().ref("Lessons/" + dict[lessonTitle]).remove();
    closeModal();
}

function edit_lesson(event) {

    var lesson_title;
    if (typeof InstallTrigger !== 'undefined') { // test if we are on firefox
        lesson_title = event.target.attributes.id;
    } else {
        lesson_title = event.path[3].children[0].childNodes[3].innerText;
    }


    localStorage.setItem('lesson_title', dict[lesson_title]);
    window.location.href = 'admin-edit.html';
}

function onAuthStateChange(user) {
    if (user) {

        // in caz ca este logat

        let userId = user.uid;
        user_uid = userId;

        // vom face apel la baza de date pentru a prelua datele despre acesta

        firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
            document.getElementById('username').innerText = snapshot.val().first_name + ' ' + snapshot.val().last_name;
            user_data = snapshot.val();
            Init();
        });
    }
    else {
        // in cazul in care iese din aplicatie, va fi redirectionat la pagina de start

        window.location = 'Start.html';
    }
}

firebase.auth().onAuthStateChanged(onAuthStateChange);


function openModal(event) {
    lessonTitle = event.path[3].children[0].childNodes[3].innerText;
    var overlay = document.getElementById('overlay');
    overlay.classList.remove("is-hidden");
    document.getElementsByClassName("navbar")[0].style.zIndex = 0;
}

function closeModal() {
    var overlay = document.getElementById('overlay');
    overlay.classList.add("is-hidden");
    document.getElementsByClassName("navbar")[0].style.zIndex = 1;
}