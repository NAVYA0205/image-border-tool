const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

upload.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (!file) return;

    const img = new Image();

    img.onload = function () {

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

    };

    img.src = URL.createObjectURL(file);

});
