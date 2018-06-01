let mousePressed = false;
let lastX, lastY;
let ctx;
let states = [];
let state_index = 0;

Object.defineProperty(Uint8ClampedArray.prototype, 'chunk', {
    value: function (chunkSize) {
        let temporal = [];

        for (let i = 0; i < this.length; i += chunkSize) {
            temporal.push(this.slice(i, i + chunkSize));
        }

        return temporal;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    InitCanvas();
    addCanvasState();
}, false);

function addCanvasState() {
    state_index++;
    states.push(document.getElementById('myCanvas').toDataURL());
}

function undo() {
    if (state_index > 0) {
        state_index--;
        let canvasImage = new Image();
        canvasImage.src = states[state_index];
        canvasImage.onload = function () {
            clearArea();
            ctx.drawImage(canvasImage, 0, 0);
        }
    }
}

function redo() {
    if (state_index < states.length - 1) {
        state_index++;
        let canvasImage = new Image();
        canvasImage.src = states[state_index];
        canvasImage.onload = function () {
            clearArea();
            ctx.drawImage(canvasImage, 0, 0);
        }
    }
}

function getElementPosition(obj) {
    let curLeft = 0, curTop = 0;
    if (obj.offsetParent) {
        do {
            curLeft += obj.offsetLeft;
            curTop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curLeft, y: curTop};
    }
    return undefined;
}

function getEventLocation(element, event) {
    let pos = getElementPosition(element);

    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function getHexString(pixelData) {
    if ((pixelData[0] === 0) && (pixelData[1] === 0) && (pixelData[2] === 0) && (pixelData[3] === 0)) {
        return '#FFFFFF';
    }

    return '#' + ('000000' + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
}

function testPixelData(element, event) {
    let eventLocation = getEventLocation(element, event);
    let pixels = ctx.getImageData(eventLocation.x, eventLocation.y, 10, 10).data;
    let chunks = pixels.chunk(8);
    for (let pixel of chunks) {
        let color = getHexString(pixel);
        if (color === '#808080') {
            return true;
        }
    }

    return false;
}

function setStrokeColor(element, event) {
    if (testPixelData(element, event)) {
        ctx.strokeStyle = 'black';
    } else {
        ctx.strokeStyle = 'red';
    }
}

function InitCanvas() {
    ctx = document.getElementById('myCanvas').getContext("2d");

    /* Mouse Input */
    document.getElementById('myCanvas').addEventListener('mousedown', function (e) {
        mousePressed = true;
        setStrokeColor(this, e);
        Draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
    }, false);

    document.getElementById('myCanvas').addEventListener('mousemove', function (e) {
        if (mousePressed) {
            setStrokeColor(this, e);
            Draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        }
    }, false);

    document.getElementById('myCanvas').addEventListener('mouseup', function (e) {
        if (mousePressed) {
            addCanvasState();
        }
        mousePressed = false;
    }, false);

    document.getElementById('myCanvas').addEventListener('mouseleave', function (e) {
        if (mousePressed) {
            addCanvasState();
        }
        mousePressed = false;
    }, false);

    /* Touch Input */
    document.getElementById('myCanvas').addEventListener('touchstart', function (e) {
        mousePressed = true;
        setStrokeColor(this, e.originalEvent.touches[0]);
        Draw(e.originalEvent.touches[0].pageX - this.offsetLeft, e.originalEvent.touches[0].pageY - this.offsetTop, false);
    }, false);

    document.getElementById('myCanvas').addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (mousePressed) {
            setStrokeColor(this, e.originalEvent.touches[0]);
            Draw(e.originalEvent.touches[0].pageX - this.offsetLeft, e.originalEvent.touches[0].pageY - this.offsetTop, true);
        }
    }, false);

    document.getElementById('myCanvas').addEventListener('touchend', function (e) {
        mousePressed = false;
    }, false);

    document.getElementById('myCanvas').addEventListener('touchcancel', function (e) {
        mousePressed = false;
    }, false);
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.lineWidth = 9;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    }
    lastX = x;
    lastY = y;
}

function forgetCanvasStates() {
    states = [];
    state_index = 0;
}

function clearArea(letter) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBackground(letter);
}

function drawBackground(letter) {
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d');
    ctx.font = "250px Arial";
    ctx.fillStyle = 'gray';
    ctx.fillText(String.fromCharCode(letter), 270, 280);
}

window.addEventListener('resize', function () {
    var canvas = document.getElementById('myCanvas');

    if (window.innerWidth === screen.width) {
        canvas.setAttribute('width', '800');
        // canvas.removeAttribute('height');
        // canvas.setAttribute('height','400');
    }
    console.log(window.innerWidth);
    canvas.removeAttribute('width');
    canvas.style.width = (innerWidth * 0.5).toString() + 'px';
    canvas.removeAttribute('height');
    canvas.setAttribute('height', '400');
})