const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const download = document.getElementById("download");
upload.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    const img = new Image();

    img.onload = function () {

        const margin = 40;

canvas.width = img.width + margin * 2;
canvas.height = img.height + margin * 2;

// Fill the entire canvas with white
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw the image in the center
ctx.drawImage(img, margin, margin);
        ctx.strokeStyle = "black";
ctx.lineWidth = 1;

ctx.strokeStyle = "black";
ctx.lineWidth = borderWidth;

ctx.strokeRect(
    0,
    0,
    canvas.width,
    canvas.height
);

    };

    img.src = URL.createObjectURL(file);

});
download.addEventListener("click", function () {

    const link = document.createElement("a");

    link.download = "edited-image.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

});
