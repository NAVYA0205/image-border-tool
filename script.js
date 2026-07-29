const upload=document.getElementById("upload");
const preview=document.getElementById("preview");
const count=document.getElementById("count");

const downloadAll=document.getElementById("downloadAll");
const clearAll=document.getElementById("clearAll");


let images=[];



upload.addEventListener("change",function(e){

for(let file of e.target.files){

processImage(file);

}

});




function processImage(file){


let img=new Image();


img.onload=function(){


let canvas=document.createElement("canvas");

canvas.width=1200;
canvas.height=900;


let ctx=canvas.getContext("2d");



ctx.fillStyle="white";

ctx.fillRect(0,0,1200,900);



// White margin around image

const padding = 80;   // increase this for more white space


let availableWidth = 1200 - (padding * 2);
let availableHeight = 900 - (padding * 2);



let scale = Math.min(
    availableWidth / img.width,
    availableHeight / img.height
);



let w = img.width * scale;
let h = img.height * scale;



// Center image

let x = (1200 - w) / 2;
let y = (900 - h) / 2;



ctx.drawImage(
    img,
    x,
    y,
    w,
    h
);



// border

ctx.strokeStyle="black";
ctx.lineWidth=8;

ctx.strokeRect(
4,
4,
1192,
892
);



let obj={
file:file,
canvas:canvas
};


images.push(obj);


createCard(obj);


updateCount();


}



img.src=URL.createObjectURL(file);


}





function createCard(obj){


let card=document.createElement("div");

card.className="card";


card.appendChild(obj.canvas);



let row=document.createElement("div");

row.className="filename";


row.innerHTML=
`
<span>${obj.file.name}</span>

<span class="delete">🗑</span>

`;



row.querySelector(".delete")
.onclick=function(){

images=images.filter(x=>x!==obj);

card.remove();

updateCount();

};



card.appendChild(row);


preview.appendChild(card);


}





function updateCount(){

count.innerHTML=
images.length+" image(s) loaded";

}





downloadAll.onclick=function(){


images.forEach((obj,i)=>{


let a=document.createElement("a");

a.download=
"WI_Image_"+(i+1)+".png";


a.href=obj.canvas.toDataURL();


a.click();


});


}





clearAll.onclick=function(){

images=[];

preview.innerHTML="";

updateCount();

}
