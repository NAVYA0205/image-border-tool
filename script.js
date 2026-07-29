const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const count = document.getElementById("count");

const downloadAll = document.getElementById("downloadAll");
const downloadZip = document.getElementById("downloadZip");
const clearAll = document.getElementById("clearAll");


const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const noiseSlider = document.getElementById("noise");


const brightnessValue = document.getElementById("brightnessValue");
const contrastValue = document.getElementById("contrastValue");
const noiseValue = document.getElementById("noiseValue");



let images = [];




// Upload images

upload.addEventListener("change", function(e){


for(let file of e.target.files){

processImage(file);

}


});





function processImage(file){


let img = new Image();



img.onload = function(){



let canvas = document.createElement("canvas");

canvas.width = 1200;

canvas.height = 900;



let obj = {

file:file,

canvas:canvas,

originalImage:img

};



images.push(obj);



drawProcessedImage(obj);



createCard(obj);



updateCount();



}



img.src = URL.createObjectURL(file);



}








// Draw processed preview

function drawProcessedImage(obj){


let canvas = obj.canvas;

let ctx = canvas.getContext("2d");



ctx.clearRect(
0,
0,
1200,
900
);



// White background

ctx.fillStyle="white";

ctx.fillRect(
0,
0,
1200,
900
);





let img = obj.originalImage;



let padding = 80;



let scale = Math.min(

(1200-padding*2)/img.width,

(900-padding*2)/img.height

);




let w = img.width * scale;

let h = img.height * scale;



let x = (1200-w)/2;

let y = (900-h)/2;





let brightness =
brightnessSlider.value;


let contrast =
contrastSlider.value;





ctx.filter =

`brightness(${brightness}%) contrast(${contrast}%)`;





ctx.drawImage(

img,

x,

y,

w,

h

);




ctx.filter="none";





// Border

ctx.strokeStyle="black";

ctx.lineWidth=8;


ctx.strokeRect(

4,

4,

1192,

892

);






// Noise reduction

if(noiseSlider.value > 0){

applyNoiseReduction(
canvas
);

}



}









// Noise reduction

function applyNoiseReduction(canvas){


let ctx =
canvas.getContext("2d");



let imgData =
ctx.getImageData(

0,

0,

canvas.width,

canvas.height

);



let data =
imgData.data;




for(let i=0;i<data.length;i+=4){


let avg =

(

data[i]+

data[i+1]+

data[i+2]

)/3;




data[i] =
(data[i]*0.75)+(avg*0.25);



data[i+1] =
(data[i+1]*0.75)+(avg*0.25);



data[i+2] =
(data[i+2]*0.75)+(avg*0.25);



}



ctx.putImageData(

imgData,

0,

0

);



}









// Create preview card

function createCard(obj){


let card =
document.createElement("div");


card.className="card";



card.appendChild(
obj.canvas
);





let row =
document.createElement("div");



row.className="filename";





row.innerHTML =

`

<span>${obj.file.name}</span>

<span class="delete">🗑</span>

`;






row.querySelector(".delete")
.onclick=function(){


images =
images.filter(
x=>x!==obj
);


card.remove();


updateCount();


};




card.appendChild(row);


preview.appendChild(card);



}









function updateCount(){


count.innerHTML =

images.length +

" image(s) loaded";


}









// LIVE slider update

function updatePreview(){


brightnessValue.innerHTML =
brightnessSlider.value+"%";


contrastValue.innerHTML =
contrastSlider.value+"%";


noiseValue.innerHTML =
noiseSlider.value;



images.forEach(obj=>{


drawProcessedImage(obj);



});


}





brightnessSlider.addEventListener(
"input",
updatePreview
);


contrastSlider.addEventListener(
"input",
updatePreview
);


noiseSlider.addEventListener(
"input",
updatePreview
);









// Download PNG images

downloadAll.onclick=function(){



images.forEach((obj,i)=>{


let a =
document.createElement("a");



a.download =
"PixPro_Image_"+(i+1)+".png";



a.href =
obj.canvas.toDataURL(
"image/png"
);



a.click();



});



}









// Download ZIP

downloadZip.onclick = async function(){



if(images.length===0){


alert("No images available");

return;


}



let zip = new JSZip();




for(let i=0;i<images.length;i++){



let dataURL =
images[i].canvas.toDataURL(
"image/png"
);



let imageData =
dataURL.split(",")[1];





zip.file(

"PixPro_Image_"+(i+1)+".png",

imageData,

{

base64:true

}

);



}




zip.generateAsync({

type:"blob"

})

.then(function(content){



let a =
document.createElement("a");



a.href =
URL.createObjectURL(content);



a.download =
"PixPro_Images.zip";



a.click();



});



}









// Clear all

clearAll.onclick=function(){



images=[];


preview.innerHTML="";


updateCount();



}
