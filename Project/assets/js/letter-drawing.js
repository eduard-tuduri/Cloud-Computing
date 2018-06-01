let animation;
let paths = [];
let json = [];
let correct_answers = [];
let pronunciation = [];
let answered_correctly = [];
let index = 0;
let lesson_score = 0;

let user_uid;

let today_progress = {
    score: 0,
    number_of_tries: 0,
    number_of_successes: 0
};

let lesson_progress = {
    number_of_drawn_letters: 0,
    total_number_of_letters: 0,
};

let lesson = localStorage.getItem('lesson_title');

let level_threshold = {

    2: "yellow",
    3: "orange",
    5: "green",
    8: "blue",
    13: "red",
    21: "purple",
    35: "brown",
    56: "black"

};

firebase.auth().onAuthStateChanged(onAuthStateChange);

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
            Init();
        });
    }
    else {
        // in cazul in care iese din aplicatie, va fi redirectionat la pagina de start

        window.location = 'Start.html';
    }
}

function Init() {
    let reference = firebase.database().ref('/Lessons/' + lesson);
    reference.on('value', getData, err => console.error("Eroare"));
}

function getData(snapshot) {
    addResources(snapshot.val().resources);
    lesson_progress.total_number_of_letters = snapshot.val().letters.length;

    for (let i = 0; i < snapshot.val().letters.length; i++) {
        pronunciation.push(snapshot.val().letters[i]);
        correct_answers.push(parseInt(snapshot.val().hex[i], 16));
        paths.push(snapshot.val().paths[i]);
        answered_correctly.push(false);
    }

    let storageRef = firebase.storage().ref();

    let count = 0;
    for (let path of paths) {
        storageRef.child(path).getDownloadURL().then(function (url) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.open('GET', url);
            xhr.onload = function (event) {
                count++;
                console.log(xhr.response);
                json.push(xhr.response);

                if (count === paths.length) {
                    setPronunciation(pronunciation[0]);
                    arrangeAnimationData();
                    InitAnimation(json[0]);
                    drawBackground(correct_answers[0]);
                }
            };
            xhr.send();
        }).catch(function (error) {
            console.error(error);
        });
    }
}

function addResources(resources) {
    if (resources !== '') {
        resources = resources.split('\n');
        let resources_html = '<h2>You might also like to see</h2>\n';

        for (let resource of resources) {
            resources_html += `<a target="_blank" href=${resource} style="color: #2e6da4;">${resource}</a>\n`;
        }

        document.getElementById('resources').innerHTML = resources_html;
    }
}

function arrangeAnimationData() {
    let temp = [];

    for (let answer of correct_answers) {
        for (let anim of json) {
            if (anim.chars[0].ch.charCodeAt(0) === answer) {
                temp.push(anim);
                break;
            }
        }
    }

    json = temp;
}


function InitAnimation(animation_json) {
    animation = bodymovin.loadAnimation({
        container: document.getElementById('bm'),
        renderer: 'svg',
        loop: false,
        autoplay: true,
        rendererSettings: {
            progresiveLoad: true,
            scaleMode: 'noScale'
        },
        animationData: animation_json
    });
}

function setPronunciation(letter) {
    document.getElementById('pron').innerText = letter;
}

function refresh() {
    document.getElementById('bm').innerHTML = '';
    setPronunciation(pronunciation[index]);
    InitAnimation(json[index]);
    clearArea(correct_answers[index]);
}

function MoveNextQuestion() {
    if (index < json.length - 1) {
        forgetCanvasStates();
        index++;
        refresh();
    }
}

function MovePreviousQuestion() {
    if (index > 0) {
        forgetCanvasStates();
        index--;
        refresh();
    }
}

function syncUserProgressData() {
    let overall_lesson_progress = {number_of_letters_drawn: 0, total_number_of_letters: 0};
    overall_lesson_progress.total_number_of_letters = correct_answers.length;
    let overall_progress = {
        score: 0,
        number_of_tries: 0,
        number_of_successes: 0
    };

    firebase.database().ref('/users/' + user_uid + '/stats/').once('value').then(function (snapshot) {

        if (typeof snapshot.val().lessons_progress !== 'undefined' && typeof snapshot.val().lessons_progress[lesson] !== 'undefined') {
            overall_lesson_progress = snapshot.val().lessons_progress[lesson];
            overall_lesson_progress.number_of_letters_drawn += lesson_progress.number_of_drawn_letters;

            let sum = 0;
            for (let a_lesson of Object.keys(snapshot.val().lessons_progress)) {

                sum += snapshot.val().lessons_progress[a_lesson].number_of_letters_drawn;

            }

            let threshold;

            for (let key of Object.keys(level_threshold)) {

                let value_of_key = parseInt(key);

                if (sum < value_of_key) {
                    break;
                }

                threshold = value_of_key;

            }

            let color;
            if (typeof level_threshold[threshold] === 'undefined') {
                color = 'grey';
            } else {
                color = level_threshold[threshold];
            }

            firebase.database().ref('/users/' + user_uid + '/stats/level').set({color: color}).then(function () {

            }).catch(function (error) {
                console.error(error);
            });


        } else {
            overall_lesson_progress.number_of_letters_drawn = lesson_progress.number_of_drawn_letters;
        }

        if (typeof snapshot.val().per_day !== 'undefined') {
            for (let day of Object.keys(snapshot.val().per_day)) {
                if (day === new Date().toDateString()) {
                    overall_progress = snapshot.val().per_day[day];
                    break;
                }
            }


            overall_progress.score += today_progress.score;
            overall_progress.number_of_tries += today_progress.number_of_tries;
            overall_progress.number_of_successes += today_progress.number_of_successes;
        } else {
            overall_progress.score = today_progress.score;
            overall_progress.number_of_tries = today_progress.number_of_tries;
            overall_progress.number_of_successes = today_progress.number_of_successes;
        }

        if (overall_lesson_progress.number_of_letters_drawn > correct_answers.length) {
            overall_lesson_progress.number_of_letters_drawn = correct_answers.length;
        }

        firebase.database().ref('/users/' + user_uid + '/stats/per_day/' + new Date().toDateString()).set(overall_progress).then(function () {

        }).catch(function (error) {
            console.error(error);
        });

        firebase.database().ref('/users/' + user_uid + '/stats/lessons_progress/' + lesson).set(overall_lesson_progress).then(function () {

        }).catch(function (error) {
            console.error(error);
        });

    }).catch(function (error) {
        alert(error.message);
    });
}

function testImage() {
    ctx = document.getElementById('myCanvas').getContext('2d');
    document.body.classList.add('loading');

    Tesseract.recognize(ctx, {
        lang: 'jpn'
    })
        .then(function (result) {
            let MULTIPLIER = 1.3;
            let score = 0;
            document.body.classList.remove('loading');
            if (result.text.charCodeAt(0) === correct_answers[index]) {
                if (result.confidence * MULTIPLIER > 100) {
                    score = 100;
                } else {
                    score = result.confidence * MULTIPLIER;
                }

                if (!answered_correctly[index]) {
                    lesson_score += score;
                    today_progress.score += score;
                    today_progress.number_of_successes += 1;
                    today_progress.number_of_tries += 1;
                    lesson_progress.number_of_drawn_letters += 1;
                    answered_correctly[index] = true;
                }

                syncUserProgressData();


                if (lesson_progress.number_of_drawn_letters === correct_answers.length) {
                    let done = `</br><h2>You're done with an average score of: ${(lesson_score / correct_answers.length).toFixed(2)}</h2></br>
                                <button class="done-button" onclick="window.location = 'ListOfLessons.html';">OK</button>`;

                    document.getElementById('result').innerHTML = '<h1>Correct</h1>' + svg_success + '</br><h2>You got a score of: ' + score.toFixed(2) + '</h2>' + done;
                } else {
                    document.getElementById('result').innerHTML = '<h1>Correct</h1>' + svg_success + '</br><h2>You got a score of: ' + score.toFixed(2) + '</h2>';
                }
                openModal();
            } else {
                today_progress.number_of_tries += 1;

                if (typeof result.symbols[0] !== 'undefined') {
                    let choices = result.symbols[0].choices;

                    for (let letter of choices) {
                        if (correct_answers[index] === letter.text.charCodeAt(0)) {
                            score = letter.confidence;
                            break;
                        }
                    }

                    syncUserProgressData();
                }

                document.getElementById('result').innerHTML = '<h1>Wrong</h1>' + svg_fail + '</br><h2>You got a score of: ' + score.toFixed(2) + '</h2>';
                openModal();
            }
        })
        .catch(function (err) {
            document.body.classList.remove('loading');
            console.error(err)
        })
}