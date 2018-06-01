var Files = new Array();

document.getElementById('drop-zone').addEventListener("dragover", function (event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.add('file-drag-over');
});

document.getElementById('drop-zone').addEventListener("dragleave", function (event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.remove('file-drag-over');
});

function showFileInPage(event) {
    var files = event.target.files || (event.dataTransfer ? event.dataTransfer.files : event.originalEvent.dataTransfer.files);
    for (file of files) {
        Files.push(file);
        var div = document.createElement("div");
        var para = document.createElement("p");
        var file_icon = document.createElement("i");
        var p_content = document.createTextNode(file.name);
        var x_icon = document.createElement('i');
        file_icon.setAttribute('class', 'fa fa-file-code-o');
        file_icon.setAttribute('aria-hiden', 'true');
        x_icon.setAttribute('class', 'fa fa-times');
        x_icon.setAttribute('aria-hiden', 'true');
        x_icon.setAttribute('onclick', 'remove(event)');
        para.appendChild(p_content);
        div.appendChild(file_icon);
        div.appendChild(para);
        div.appendChild(x_icon);
        div.classList.add('uploaded-files');
        document.getElementById('panel-body').appendChild(div);
    }
}


document.getElementById('drop-zone').addEventListener("drop", function (event) {
    event.preventDefault();
    document.getElementById('drop-zone').classList.remove('file-drag-over');
    showFileInPage(event);
});

function remove(event) {
    file_name = event.path[1].innerText;
    for (file of Files) {
        if (file.name === file_name) {
            Files.splice(Files.indexOf(file), 1);
        }
    }
    event.srcElement.parentNode.parentNode.removeChild(event.srcElement.parentNode);
}

function add_description() {
    index = document.getElementsByClassName("exercise-description").length + 1;
    var div = document.createElement("div");
    div.setAttribute('class', 'exercise-description form-group');
    div.setAttribute('id', 'exercises' + index);
    document.getElementById("exercises-description").appendChild(div)
    document.getElementById('exercises' + index).innerHTML = "<div class=\"ex-element\">\n" +
        "                                    <label>Letter " + index + ":</label>\n" +
        "                                    <input type=\"text\" class=\"exercises-input\" id=\"letter " + index + "\">\n" +
        "                                </div>\n" +
        "                                <div class=\"ex-element\">\n" +
        "                                    <label>Letter " + index + " hex:</label>\n" +
        "                                    <input type=\"text\" class=\"exercises-input\" id=\"hex" + index + "\">\n" +
        "                                </div><i class=\"fa fa-times\" aria-hidden=\"true\" onclick=\"remove(event)\"></i>"
}

// data base
function Init() {

    // if (localStorage.getItem('lesson_title') !== '') {
    //     console.log("yes");
    //     var refFireBase = firebase.database().ref('/Lessons/' + localStorage.getItem('lesson_title'));
    //     refFireBase.on('value', editData, errData);
    // }
}

function Submit(event) {
    var lesson = document.getElementById("lesson-title").value;
    var descriptions = document.getElementsByClassName("exercises-input");
    var resources_of_interest = document.getElementById("text-area").value;
    console.log(resources_of_interest);
    create_lesson(lesson, descriptions, resources_of_interest);
}

function create_lesson(lesson, descriptions, resources_of_interest) {
    var Letters = new Array();
    var Hex = new Array();
    for (i = 0; i < descriptions.length; i++) {
        if (i % 2 === 0) {
            Letters.push(descriptions[i].value);
        }
        else {
            Hex.push(descriptions[i].value);
        }
    }
    for (file of Files) {
        var storageRef = firebase.storage().ref('jsons/' + file.name);
        storageRef.put(file);
    }

    var Paths = new Array();
    for (file of Files) {
        Paths.push("jsons/" + file.name);
    }

    var Lesson = {
        lesson_name: lesson,
        letters: Letters,
        hex: Hex,
        paths: Paths,
        resources: resources_of_interest
    };
    console.log(Lesson);

    var firebaseRef = firebase.database().ref();
    firebaseRef.child('Lessons').push(Lesson).then(function () {
        document.getElementsByClassName('modal-content')[0].style.width = '25%';
        document.getElementsByClassName('modal-content')[0].style.height = '25%';

        document.getElementById('result').innerHTML = '<h1> Lesson has been uploaded</h1>' + svg_success;
        openModal();
        setTimeout(function(){
                window.location.href = 'admin-lesson-list.html';
        },2000);
    }).catch(function (error) {
        document.getElementsByClassName('modal-content')[0].style.width = '25%';
        document.getElementsByClassName('modal-content')[0].style.height = '25%';

        document.getElementById('result').innerHTML = '<h1> Ooops! Something went wrong</h1>' + svg_fail;
        openModal();
    });

}

