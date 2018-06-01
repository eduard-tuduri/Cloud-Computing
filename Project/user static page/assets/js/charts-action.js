google.charts.load('visualization', '1.0', {
    'packages': ['corechart']

});



google.charts.setOnLoadCallback(initialize);

let total_number_of_letters = 0;


function initialize() {


    var area_chart_uri = '';
    var donut_char_uri = '';
    var line_chart_uri = '';

    var user_stats = '';

    firebase.auth().onAuthStateChanged(onAuthStateChange);

    function onAuthStateChange(user) {
        if (user) {

            // in caz ca este logat

            var userId = user.uid;
            user_uid = userId;

            // vom face apel la baza de date pentru a prelua datele despre acesta

            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {

                user_stats = snapshot.val().stats;

                // pentru donut_chart
                function getTotalNumberOfLettersDrawn(user_stats){

                    var count = 0;
                    for(var key in user_stats.lessons_progress){
                        count += user_stats.lessons_progress[key].number_of_letters_drawn;
                    }

                    return count;
                }

                function getTotalNumberOfLetters(){


                }


                // pentru area_chart
                function getArrayOfScorePerDay(user_stats){

                    var array = [];

                    for(var day in user_stats.per_day){

                        array.push([new Date(day),user_stats.per_day[day].score])

                    }

                     array.sort(function(a,b){

                        return a[0] - b[0];

                    });

                    array.splice(0,0,['Day','Score']);


                    /*
                        in caz ca nu avem date destule pentru grafic, il vom initializa cu o valoare dummy
                     */

                    if(array.length == 1){
                        array.push(['No data',0]);
                    }
                    return array;

                }

                // pentru line_chart
                function getArrayOfTotalTriesAndSuccessesPerDay(user_stats){
                    var array = [];

                    for(var day in user_stats.per_day){
                        array.push([new Date(day),user_stats.per_day[day].number_of_tries,user_stats.per_day[day].number_of_successes])
                    }



                    array.sort(function(a,b){

                        return a[0] - b[0];

                    });

                    array.splice(0,0,['Day','Tries','Successes']);

                    /*
                         in caz ca nu avem date destule pentru grafic, il vom initializa cu o valoare dummy
                    */
                    if(array.length == 1){
                        array.push(['No data', 0,0]);
                    }

                    return array;
                }

                // Begin Data


                var data_for_area_chart = google.visualization.arrayToDataTable(getArrayOfScorePerDay(user_stats));





                    firebase.database().ref('/Lessons/').once('value').then(function (snapshot){



                        for(var a_lesson of Object.keys(snapshot.val())){

                            total_number_of_letters += snapshot.val()[a_lesson].letters.length;

                        }


                    });


                var data_for_donut_chart = google.visualization.arrayToDataTable([
                    ['Task', 'Hours per Day'],
                    ['Drawn', getTotalNumberOfLettersDrawn(user_stats)],
                    ['Remaining', total_number_of_letters]
                ]);



                var data_for_line_chart = google.visualization.arrayToDataTable(getArrayOfTotalTriesAndSuccessesPerDay(user_stats));

                // End Data

                // Begin Options
                var options_area_chart = {
                    title: 'Total score per day',
                    is3D: true,
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    height: 220,
                    animation: {
                        "startup": true,
                        duration: 1300,
                        easing: 'out'
                    }
                };


                var options_donut_chart = {
                    title: 'Total number of symbols drawn',
                    height: 250,
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    pieHole: 0.4,
                    chartArea: {
                        left: 0,
                        top: 25,
                        width: "100%",
                        height: "100%"
                    },

                    animation: {
                        "startup": true,
                        duration: 1300,
                        easing: 'out'
                    }

                };

                var options_line_chart = {
                    title: 'Tries and successes per day',
                    is3D: true,
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    height: 250,
                    curveType: 'function',
                    animation: {
                        "startup": true,
                        duration: 1300,
                        easing: 'out'
                    }
                };

                // End Options




                function drawChart() {


                    var area_chart_div = document.getElementById('area_chart');
                    var donut_chart_div = document.getElementById('donut_chart');
                    var line_chart_div = document.getElementById('line_chart');


                    var a_chart = new google.visualization.AreaChart(area_chart_div);
                    var d_chart = new google.visualization.PieChart(donut_chart_div);
                    var l_chart = new google.visualization.LineChart(line_chart_div);


                    var storageRef = firebase.storage().ref();


                    google.visualization.events.addListener(a_chart, 'ready', function () {



                        storageRef.child('user_charts/'+userId+'/area_chart.png').putString(a_chart.getImageURI().substring(22),'base64', {contentType:'image/png'}).then(function(snapshot){

                                document.getElementById('area_chart_google_share').setAttribute('href','https://plus.google.com/share?url=' + encodeURI(snapshot.downloadURL));

                        });

                    });

                    google.visualization.events.addListener(d_chart, 'ready', function () {

                        storageRef.child('user_charts/'+userId+'/donut_chart.png').putString(d_chart.getImageURI().substring(22),'base64',{contentType:'image/png'}).then(function(snapshot){

                            document.getElementById('donut_chart_google_share').setAttribute('href','https://plus.google.com/share?url=' + encodeURI(snapshot.downloadURL));

                        });

                    });

                    google.visualization.events.addListener(l_chart, 'ready', function () {

                        storageRef.child('user_charts/'+userId+'/line_chart.png').putString(l_chart.getImageURI().substring(22),'base64',{contentType:'image/png'}).then(function(snapshot){

                            document.getElementById('line_chart_google_share').setAttribute('href','https://plus.google.com/share?url=' + encodeURI(snapshot.downloadURL));

                        });

                    });


                    // Begin Drawing

                    a_chart.draw(data_for_area_chart, options_area_chart);
                    d_chart.draw(data_for_donut_chart, options_donut_chart);
                    l_chart.draw(data_for_line_chart, options_line_chart);

                    // End Drawing


                    // Load charts URI for share

                }



                drawChart();

            });
        }
        else
        {
            // in cazul in care iese din aplicatie, va fi redirectionat la pagina de start

            window.location = '../Start.html';
        }
    }





}
