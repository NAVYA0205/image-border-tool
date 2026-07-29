const upload = document.getElementById("upload");
const preview = document.getElementById("preview");


upload.addEventListener("change", function(event){


const files = event.target.files;


preview.innerHTML="";


for(let file of files){


const img = new Image();


img.onload=function(){



// 4:3 canvas size
const canvas=document.createElement("canvas");

const canvasWidth=1200;
const canvasHeight=900;


canvas.width=canvasWidth;
canvas.height=canvasHeight;



const ctx=canvas.getContext("2d");



// White background

ctx.fillStyle="white";

ctx.fillRect(
0,
0,
canvasWidth,
canvasHeight
);



// Image scaling

const scale=Math.min(
canvasWidth/img.width,
canvasHeight/img.height
);



const newWidth=img.width*scale;

const newHeight=img.height*scale;



// Center image

const x=(canvasWidth-newWidth)/2;

const y=(canvasHeight-newHeight)/2;



ctx.drawImage(
img,
x,
y,
newWidth,
newHeight
);



// Black border

ctx.strokeStyle="black";

ctx.lineWidth=8;


ctx.strokeRect(
4,
4,
canvasWidth-8,
canvasHeight-8
);



// Add download button

let div=document.createElement("div");


let button=document.createElement("button");


button.innerHTML="Download";


button.onclick=function(){


let link=document.createElement("a");

link.download="WI_Image_"+Date.now()+".png";

link.href=canvas.toDataURL("image/png");

link.click();


};



div.appendChild(canvas);

div.appendChild(button);


preview.appendChild(div);



}



img.src=URL.createObjectURL(file);



}



});
