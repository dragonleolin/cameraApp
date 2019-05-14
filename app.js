var imageUploader = {
    imageFile: null,
    canvasCtx: document.getElementById("panel").getContext("2d"),
    /**
     * Trigger this object by setting up basic events.
     */
    init: function() {
        document.getElementById("uploadImage").onclick = this.uploadImage.bind(this);
        document.getElementById("uploadCanvas").onclick = this.uploadCanvasAsImage.bind(this);
        document.getElementById("file").onchange = function(event) {
            this.imageFile = event.target.files[0];
            document.getElementById("fileInfo").innerHTML = "File Name: " + this.imageFile.name + "<br> Image type: " + this.imageFile.type;
            var reader = new FileReader();
            reader.onload = function(event) {
                var img = new Image();
                img.onload = function() {
                    this.drawImageOnCanvas(img);
                    this.displayImage(img);
                }.bind(this)
                img.src = event.target.result;
            }.bind(this);
            reader.readAsDataURL(this.imageFile);
        }.bind(this);
    },
    /**
     * Draw uploaded image on Canvas
     */
    drawImageOnCanvas: function(img) {
        this.canvasCtx.canvas.width = img.width;
        this.canvasCtx.canvas.height = img.height;
        this.canvasCtx.drawImage(img, 0, 0);
        //Some update on canvas
        this.canvasCtx.font = "30px serif"
        this.canvasCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.canvasCtx.fillText(this.imageFile.name, 5, img.height - 8);
    },
    /**
     * Basic image display as per the uploaded image.
     */
    displayImage: function(img) {
        document.getElementById("uploadedImage").src = img.src;
    },
    /**
     * canvas data uri return the Base64 encoded image, we need to conver into a binary file
     * before sending it to server.
     *
     */
    canvasToBlob: function(canvas, type) {
        var byteString = atob(canvas.toDataURL().split(",")[1]),
            ab = new ArrayBuffer(byteString.length),
            ia = new Uint8Array(ab),
            i;
        for (i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: type
        });
    },
    /**
     * Upload basic image or file to server.
     */
    uploadImage: function() {
        var data = new FormData();
        data.append("file", this.imageFile);
        this.uploadToServer(data);
    },
    /**
     * Add extra parmeter, in case of Canvas upload.
     */
    uploadCanvasAsImage: function() {
        var data = new FormData();
        var blob = this.canvasToBlob(this.canvasCtx.canvas, this.imageFile.type);
        data.append("blob", blob);
        data.append("blobName", this.imageFile.name);
        data.append("blobType", this.imageFile.type);
        this.uploadToServer(data);
    },
    uploadToServer: function(formData) {
        //Uncomment when you server ready
        xhr = new XMLHttpRequest();
        xhr.open("post", "ftp://file.stantex.com.tw/QCWEB/", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                alert(xhr.responseText);
            }
        };
        xhr.send(formData);
    }
}
/**
 * Trigger the app.
 */
imageUploader.init();