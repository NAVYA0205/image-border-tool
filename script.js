// ==========================
// ELEMENTS
// ==========================

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

brightnessValue.textContent = brightnessSlider.value + "%";
contrastValue.textContent = contrastSlider.value + "%";
noiseValue.textContent = noiseSlider.value;


// ==========================
// FILENAME SORTER
// ==========================

function parseFileName(name){

    name = name.replace(/\.[^/.]+$/, "");

    const parts = name.split("-");

    return{

        prefix : parts[0] || "",

        middle : parts[1] || "",

        main : parseInt(parts[2]) || 0,

        sub : parts.length > 3 ? parseInt(parts[3]) : 0

    };

}

function sortImages(){

    images.sort((a,b)=>{

        const A = parseFileName(a.file.name);

        const B = parseFileName(b.file.name);

        if(A.prefix !== B.prefix)
            return A.prefix.localeCompare(B.prefix);

        if(A.middle !== B.middle)
            return A.middle.localeCompare(B.middle);

        if(A.main !== B.main)
            return A.main - B.main;

        return A.sub - B.sub;

    });

}


// ==========================
// IMAGE LOADER
// ==========================

function processImage(file){

    return new Promise(resolve=>{

        const img = new Image();

        img.onload=function(){

            const canvas=document.createElement("canvas");

            canvas.width=1200;
            canvas.height=900;

            resolve({

                file:file,

                canvas:canvas,

                originalImage:img,

                caption:""

            });

        };

        img.src=URL.createObjectURL(file);

    });

}


// ==========================
// UPLOAD
// ==========================

upload.addEventListener("change",async function(e){

    const files=[...e.target.files];

    if(files.length===0) return;

    const loaded=await Promise.all(

        files.map(processImage)

    );

    images.push(...loaded);

    sortImages();

    rebuildPreview();

    upload.value="";

});
// ==========================
// REBUILD PREVIEW
// ==========================

function rebuildPreview(){

    preview.innerHTML="";

    images.forEach(obj=>{

        drawProcessedImage(obj);

        createCard(obj);

    });

    updateCount();

}


// ==========================
// UPDATE COUNT
// ==========================

function updateCount(){

    count.textContent = images.length + " image(s) loaded";

}


// ==========================
// LIVE SLIDERS
// ==========================

brightnessSlider.addEventListener("input",updatePreview);
contrastSlider.addEventListener("input",updatePreview);
noiseSlider.addEventListener("input",updatePreview);

function updatePreview(){

    brightnessValue.textContent =
    brightnessSlider.value + "%";

    contrastValue.textContent =
    contrastSlider.value + "%";

    noiseValue.textContent =
    noiseSlider.value;

    images.forEach(drawProcessedImage);

}


// ==========================
// DRAW IMAGE
// ==========================

function drawProcessedImage(obj){

    const canvas=obj.canvas;

    const ctx=canvas.getContext("2d");

    ctx.clearRect(0,0,1200,900);

    ctx.fillStyle="white";
    ctx.fillRect(0,0,1200,900);

    const img=obj.originalImage;

    const left=80;
    const top=80;
    const bottom=140;

    const availWidth=1200-left*2;
    const availHeight=900-top-bottom;

    const scale=Math.min(
        availWidth/img.width,
        availHeight/img.height
    );

    const w=img.width*scale;
    const h=img.height*scale;

    const x=(1200-w)/2;
    const y=top+(availHeight-h)/2;

    ctx.filter=
    `brightness(${brightnessSlider.value}%)
     contrast(${contrastSlider.value}%)`;

    ctx.drawImage(img,x,y,w,h);

    ctx.filter="none";

    ctx.strokeStyle="black";
    ctx.lineWidth=8;
    ctx.strokeRect(4,4,1192,892);

    if(Number(noiseSlider.value)>0){

        applyNoiseReduction(
            canvas,
            Number(noiseSlider.value)
        );

    }

    // Figure Number
    const figureNumber = images.indexOf(obj)+1;

    const caption =
        obj.caption.trim() || `Figure ${figureNumber}`;

    ctx.fillStyle="black";
    ctx.font="bold 28px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.fillText(
        caption,
        600,
        850
    );

}
// ==========================
// NOISE REDUCTION
// ==========================

function applyNoiseReduction(canvas, strength){

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const data = imageData.data;

    for(let pass=0; pass<strength; pass++){

        for(let i=0;i<data.length;i+=4){

            const avg = (
                data[i] +
                data[i+1] +
                data[i+2]
            ) / 3;

            data[i]   = data[i]*0.75 + avg*0.25;
            data[i+1] = data[i+1]*0.75 + avg*0.25;
            data[i+2] = data[i+2]*0.75 + avg*0.25;

        }

    }

    ctx.putImageData(imageData,0,0);

}


// ==========================
// CREATE PREVIEW CARD
// ==========================

function createCard(obj){

    const card = document.createElement("div");

    card.className = "card";

    card.appendChild(obj.canvas);


    // Caption box

    const captionBox = document.createElement("input");

    captionBox.type = "text";

    captionBox.placeholder = "Enter caption (optional)";

    captionBox.className = "caption-input";

    captionBox.value = obj.caption;

    captionBox.oninput = function(){

        obj.caption = this.value;

        drawProcessedImage(obj);

    };

    card.appendChild(captionBox);


    // Filename row

    const row = document.createElement("div");

    row.className = "filename";

    row.innerHTML = `
        <span>${obj.file.name}</span>
        <span class="delete">🗑</span>
    `;


    // Delete

    row.querySelector(".delete").onclick = function(){

        images = images.filter(image => image !== obj);

        sortImages();

        rebuildPreview();

    };


    card.appendChild(row);

    preview.appendChild(card);

}
// ==========================
// DOWNLOAD ALL PNG
// ==========================

downloadAll.onclick = function () {

    if(images.length === 0){

        alert("No images available.");

        return;

    }

    images.forEach((obj,index)=>{

        const a = document.createElement("a");

        a.href = obj.canvas.toDataURL("image/png");

        a.download = `Figure_${index+1}.png`;

        a.click();

    });

};


// ==========================
// DOWNLOAD ZIP
// ==========================

downloadZip.onclick = async function(){

    if(images.length===0){

        alert("No images available.");

        return;

    }

    const zip = new JSZip();

    images.forEach((obj,index)=>{

        const dataURL = obj.canvas.toDataURL("image/png");

        const base64 = dataURL.split(",")[1];

        zip.file(

            `Figure_${index+1}.png`,

            base64,

            {

                base64:true

            }

        );

    });

    const content = await zip.generateAsync({

        type:"blob"

    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(content);

    a.download = "PixPro_Images.zip";

    a.click();

};


// ==========================
// CLEAR ALL
// ==========================

clearAll.onclick = function(){

    images=[];

    preview.innerHTML="";

    upload.value="";

    updateCount();

};


// ==========================
// INITIALIZE
// ==========================

updateCount();
