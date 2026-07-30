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


// ==========================
// IMAGE ARRAY
// ==========================

let images = [];


// ==========================
// SLIDER VALUE DISPLAY
// ==========================

brightnessValue.innerHTML = brightnessSlider.value + "%";
contrastValue.innerHTML = contrastSlider.value + "%";
noiseValue.innerHTML = noiseSlider.value;

// ==========================
// UPLOAD IMAGES
// ==========================

upload.addEventListener("change", async function (e) {

    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const loadedImages = await Promise.all(
        files.map(file => processImage(file))
    );

    images.push(...loadedImages);

    // Sort by filename
    images.sort((a, b) =>
        a.file.name.localeCompare(
            b.file.name,
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        )
    );

    // Rebuild preview
    preview.innerHTML = "";

    images.forEach(obj => {

        drawProcessedImage(obj);

        createCard(obj);

    });

    updateCount();

    // Allow selecting the same files again
    upload.value = "";

});





// ==========================
// LIVE PREVIEW
// ==========================

brightnessSlider.addEventListener("input", updatePreview);
contrastSlider.addEventListener("input", updatePreview);
noiseSlider.addEventListener("input", updatePreview);


function updatePreview(){

    brightnessValue.innerHTML =
    brightnessSlider.value + "%";

    contrastValue.innerHTML =
    contrastSlider.value + "%";

    noiseValue.innerHTML =
    noiseSlider.value;

    images.forEach(function(obj){

        drawProcessedImage(obj);

    });

}



// ==========================
// UPDATE COUNT
// ==========================

function updateCount(){

    count.innerHTML =
    images.length + " image(s) loaded";

}



// ==========================
// RENUMBER FIGURES
// ==========================

function refreshFigureNumbers(){

    images.forEach(function(obj){

        drawProcessedImage(obj);

    });

}
// ==========================
// PROCESS IMAGE
// ==========================

function processImage(file) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = function () {

            const canvas = document.createElement("canvas");

            canvas.width = 1200;
            canvas.height = 900;

            resolve({
                file: file,
                canvas: canvas,
                originalImage: img,
                caption: ""
            });

        };

        img.src = URL.createObjectURL(file);

    });

}



// ==========================
// DRAW IMAGE
// ==========================

function drawProcessedImage(obj){

    let canvas = obj.canvas;

    let ctx = canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // White Background

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        1200,
        900
    );



    let img = obj.originalImage;



    // Leave bottom space for caption

    const leftRightPadding = 80;

    const topPadding = 80;

    const bottomPadding = 140;



    let availableWidth =
    1200 - (leftRightPadding * 2);

    let availableHeight =
    900 - topPadding - bottomPadding;



    let scale = Math.min(

        availableWidth / img.width,

        availableHeight / img.height

    );



    let w = img.width * scale;

    let h = img.height * scale;



    let x =
    (1200 - w) / 2;

    let y =
    topPadding + (availableHeight - h) / 2;



    // Brightness & Contrast

    ctx.filter =

    `brightness(${brightnessSlider.value}%)
     contrast(${contrastSlider.value}%)`;



    ctx.drawImage(

        img,

        x,

        y,

        w,

        h

    );



    ctx.filter = "none";
        // ==========================
    // BLACK BORDER
    // ==========================

    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;

    ctx.strokeRect(
        4,
        4,
        1192,
        892
    );


    // ==========================
    // NOISE REDUCTION (OPTIONAL)
    // ==========================

    if (Number(noiseSlider.value) > 0) {

        applyNoiseReduction(
            canvas,
            Number(noiseSlider.value)
        );

    }


    // ==========================
    // FIGURE CAPTION
    // (INSIDE BORDER)
    // ==========================

  let figureNumber = images.indexOf(obj) + 1;


let captionText = obj.caption.trim();


if(captionText === ""){

    captionText = "Figure " + figureNumber;

}


ctx.fillStyle = "black";

ctx.font = "bold 28px Arial";

ctx.textAlign = "center";

ctx.textBaseline = "middle";


ctx.fillText(

    captionText,

    canvas.width / 2,

    850

);

}
// ==========================
// NOISE REDUCTION
// ==========================

function applyNoiseReduction(canvas, strength) {

    let ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let data = imageData.data;

    // Apply multiple passes based on slider value
    for (let pass = 0; pass < strength; pass++) {

        for (let i = 0; i < data.length; i += 4) {

            let avg = (
                data[i] +
                data[i + 1] +
                data[i + 2]
            ) / 3;

            data[i]     = data[i] * 0.75 + avg * 0.25;
            data[i + 1] = data[i + 1] * 0.75 + avg * 0.25;
            data[i + 2] = data[i + 2] * 0.75 + avg * 0.25;

        }

    }

    ctx.putImageData(
        imageData,
        0,
        0
    );

}



// ==========================
// CREATE PREVIEW CARD
// ==========================

function createCard(obj) {

    let card = document.createElement("div");

    card.className = "card";

    card.appendChild(obj.canvas);
let captionBox = document.createElement("input");

captionBox.type = "text";

captionBox.placeholder = "Enter caption (optional)";

captionBox.className = "caption-input";


captionBox.value = obj.caption;


captionBox.oninput = function(){

    obj.caption = this.value;

    drawProcessedImage(obj);

};


card.appendChild(captionBox);


    let row = document.createElement("div");

    row.className = "filename";



    row.innerHTML = `

        <span>${obj.file.name}</span>

        <span class="delete">🗑</span>

    `;
row.querySelector(".delete").onclick = function () {

    images = images.filter(image => image !== obj);

    preview.innerHTML = "";

    images.forEach(image => {

        drawProcessedImage(image);

        createCard(image);

    });

    updateCount();

};


    

    card.appendChild(row);

    preview.appendChild(card);

}
// ==========================
// DOWNLOAD ALL PNG
// ==========================

downloadAll.onclick = function () {

    if (images.length === 0) {

        alert("No images available.");

        return;

    }

    images.forEach(function (obj, index) {

        let a = document.createElement("a");

        a.href = obj.canvas.toDataURL("image/png");

        a.download = "Figure_" + (index + 1) + ".png";

        a.click();

    });

};



// ==========================
// DOWNLOAD ZIP
// ==========================

downloadZip.onclick = async function () {

    if (images.length === 0) {

        alert("No images available.");

        return;

    }

    let zip = new JSZip();

    images.forEach(function (obj, index) {

        let dataURL = obj.canvas.toDataURL("image/png");

        let imageData = dataURL.split(",")[1];

        zip.file(
            "Figure_" + (index + 1) + ".png",
            imageData,
            {
                base64: true
            }
        );

    });

    let content = await zip.generateAsync({
        type: "blob"
    });

    let a = document.createElement("a");

    a.href = URL.createObjectURL(content);

    a.download = "PixPro_Images.zip";

    a.click();

};



// ==========================
// CLEAR ALL
// ==========================

clearAll.onclick = function () {

    images = [];

    preview.innerHTML = "";

    upload.value = "";

    updateCount();

};



// ==========================
// INITIAL COUNT
// ==========================

updateCount();
