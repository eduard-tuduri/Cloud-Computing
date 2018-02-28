function getRandomQuote() {
    document.getElementById('quotes').innerHTML = '';
    let selector = document.getElementById('categories');
    let category = selector.options[selector.selectedIndex].value;

    let apiUrl = 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=' + category + '&count=1';
    let apiKey = 'X-Mashape-Key:vL9mZr9ea1msh0DbE4B1aiiUTv4Pp1GA3oAjsnkgEUOC0hUr0o';
    let apiHeader = 'Accept:application/json';

    let request = new XMLHttpRequest();

    request.addEventListener('load', function (event) {
        if (event.srcElement.readyState === 4 && event.srcElement.status === 200) {
            let responseObj = JSON.parse(event.srcElement.response);
            let html = '<p><b>' + responseObj.author + ': </b>' + responseObj.quote + '</p>';
            document.getElementById('quotes').innerHTML += html;

            yoda(responseObj.quote);
        } else {
            alert('Something went wrong when accesing the quotes API');
        }

    });

    request.open('GET', apiUrl);

    request.setRequestHeader(apiKey.split(':')[0], apiKey.split(':')[1]);
    request.setRequestHeader(apiHeader.split(':')[0], apiHeader.split(':')[1]);

    request.send();
}

function yoda(text) {
    //    let apiUrl = 'http://api.funtranslations.com/translate/yoda.json?text=' + text.replace(' ', '+');
    let apiUrl = 'https://yoda.p.mashape.com/yoda?sentence=' + text.replace(' ', '+');
    let apiKey = 'X-Mashape-Key:vL9mZr9ea1msh0DbE4B1aiiUTv4Pp1GA3oAjsnkgEUOC0hUr0o';
    let apiHeader = 'Accept:text/plain';

    let request = new XMLHttpRequest();

    request.addEventListener('load', function (event) {
        if (event.srcElement.readyState === 4 && event.srcElement.status === 200) {
            //            let apiResponse = JSON.parse(event.srcElement.response);
            //            let html = '<p><b>Master Yoda: </b>' + apiResponse.contents.translated + '</p>';

            let html = '<p><b>Master Yoda: </b>' + event.srcElement.responseText + '</p>';

            document.getElementById('quotes').innerHTML += html;

            sentiment(text, event.srcElement.responseText);
        } else {
            let html = '<p style="color: red;"> ERROR: Master Yoda became one with the force</p>';
            document.getElementById('quotes').innerHTML += html;
        }

    });

    request.open('GET', apiUrl);

    request.setRequestHeader(apiKey.split(':')[0], apiKey.split(':')[1]);
    request.setRequestHeader(apiHeader.split(':')[0], apiHeader.split(':')[1]);

    request.send();
}

function sentiment(text1, text2) {
    let apiUrl = 'https://community-sentiment.p.mashape.com/text/';
    let apiKey = 'X-Mashape-Key:vL9mZr9ea1msh0DbE4B1aiiUTv4Pp1GA3oAjsnkgEUOC0hUr0o';
    let apiContentType = 'Content-Type:application/x-www-form-urlencoded';
    let apiHeader = 'Accept:application/json';
    let param1 = 'txt=' + text1;
    let param2 = 'txt=' + text2;

    let request1 = new XMLHttpRequest();

    request1.addEventListener('load', function (event) {
        if (event.srcElement.readyState === 4 && event.srcElement.status === 200) {
            let sentiment1Obj = JSON.parse(event.srcElement.response);
            let html = '<p><b>Original Quote: </b>' + JSON.stringify(sentiment1Obj) + '</p>';
            document.getElementById('quotes').innerHTML += html;
        } else {
            alert('Cannot get sentiment from quote');
        }

    });

    request1.open('POST', apiUrl);

    request1.setRequestHeader(apiKey.split(':')[0], apiKey.split(':')[1]);
    request1.setRequestHeader(apiContentType.split(':')[0], apiContentType.split(':')[1]);
    request1.setRequestHeader(apiHeader.split(':')[0], apiHeader.split(':')[1]);

    request1.send(param1);

    let request2 = new XMLHttpRequest();

    request2.addEventListener('load', function (event) {
        if (event.srcElement.readyState === 4 && event.srcElement.status === 200) {
            let sentiment2Obj = JSON.parse(event.srcElement.response);
            let html = '<p><b>Master Yoda: </b>' + JSON.stringify(sentiment2Obj) + '</p>';
            document.getElementById('quotes').innerHTML += html;
        } else {
            let html = '<p style="color: red;"> Master Yoda mind tricked the sentiment analysis AI</p>';
            document.getElementById('quotes').innerHTML += html;
        }

    });

    request2.open('POST', apiUrl);

    request2.setRequestHeader(apiKey.split(':')[0], apiKey.split(':')[1]);
    request2.setRequestHeader(apiContentType.split(':')[0], apiContentType.split(':')[1]);
    request2.setRequestHeader(apiHeader.split(':')[0], apiHeader.split(':')[1]);

    request2.send(param2);
}
