var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

/* Default stroke color and size */
var x = "black",
y = 2;

/* Initialise the whiteboard */
function init() {
canvas = document.getElementById('can');
ctx = canvas.getContext("2d");
w = canvas.width;
h = canvas.height;



/* to make out the points where the cursor clicked */
canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
}, false);
}


/* Color selection */
function color(obj) {
switch (obj.id) {
    case "blue":
        x = "blue";
        break;
    case "red":
        x = "red";
        break;
    case "yellow":
        x = "yellow";
        break;
    case "black":
        x = "black";
        break;
    case "white":
        x = "white";
        break;
}
if (x == "white") y = 14;
else y = 2;

}

/* Function to draw on whiteboard and announce to everone that you drew */
function draw() {
  var  data={
        pX :prevX, 
        pY :prevY , 
        cX :currX , 
        cY :currY , 
        xi :x , 
        yi :y
    }
ctx.beginPath();
ctx.moveTo(prevX, prevY);
ctx.lineTo(currX, currY);
ctx.strokeStyle = x;
ctx.lineWidth = y;
ctx.stroke();
ctx.closePath();
socket.emit("drawn", data);                                      //Send everyone in room the data and tell them to draw what who drew
}

const drawing=(data)=>{
    ctx.beginPath();
    ctx.moveTo(data.pX, data.pY);
    ctx.lineTo(data.cX, data.cY);
    ctx.strokeStyle = data.xi;
    ctx.lineWidth = data.yi;
    ctx.stroke();
    ctx.closePath();
}

/*Funcion to clear whiteboard */
function erase() {
var m = confirm("Sure to clear the Board?");
if (m) {
    ctx.clearRect(0, 0, w, h);
    socket.emit("clear_wb");            //Announce to everyone in room to clear the board
}
}

/*Function to clear whiteboard when recieved from socket*/
ClearWb=()=>{
    ctx.clearRect(0, 0, w, h);
}


/*Function to download whiteboard data */
function save() {
    var dataURL = canvas.toDataURL();
    downloadImage(dataURL, 'image.png');
}
function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}


/*Function to figure the co-ordinates to mark */
function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw(prevX , prevY , currX , currY , x , y);
        }
    }
}

/* Functions to toggle between videos and whiteboard and thus setting their buttons as per the functoin */
const openCloseWb=()=> {
const state=document.getElementById("myForm").style.display;
if(state==="none"){
    document.getElementById("myForm").style.display = "block";
  document.getElementById("video-grid").style.display = "none";
  setVideoButton();
}else{
    document.getElementById("myForm").style.display = "none";
    document.getElementById("video-grid").style.display = "block";
    setWbButton();
}
}

const setVideoButton=()=>{
    const html=`<span>Videos</span>`
    document.querySelector('.main__wb__button').innerHTML=html;
}

const setWbButton=()=>{
    const html=`<span>Whiteboard</span>`
    document.querySelector('.main__wb__button').innerHTML=html;
}