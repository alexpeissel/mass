Template.uploader.events({
    'change #fileInput': function (event, template) {
        console.log("Starting upload");

        var fr = new FileReader;

        fr.onload = function () {
            var img = new Image;

            img.onload = function () {
                detectMarker(img, tempCanvas)
            };

            img.src = fr.result;
        };

        //fr.readAsDataURL(this.files[0]);


        var image = new Image();
        image.src = "/images/pic2.jpg";
        console.log(image.width + " " + image.height);

        var tempCanvas = document.createElement("canvas");
        tempCanvas.id = "tempCanvas";
        tempCanvas.style.visibility = "hidden";
        tempCanvas.width = 100;
        tempCanvas.height = 100;

        detectMarker(image, tempCanvas);

        function detectMarker(img, canvas) {

            var context = canvas.getContext("2d");
            console.log(img.width + " " + img.height);
            canvas.width = img.width;
            canvas.height = img.height;

            console.log("Canvas " + canvas.id + " found with width: " + canvas.width + " Height: " + canvas.height);

            var modelSize = 35.0; //millimeters

            var validImage = {
                imageData: "dataGoesHere",
                rotationX: null,
                rotationY: null,
                rotationZ: null,
                positionX: null,
                positionY: null,
                positionZ: null
            };

            console.log("Initilizing detectors");
            detector = new AR.Detector();
            posit = new POS.Posit(modelSize, canvas.width);

            console.log("Drawing image " + img.name + " to canvas " + canvas.id);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            //By wrapping in onload, bug prevented where canvas was not yet ready for access
            canvas.onload = function () {
                console.log("Canvas " + canvas.id + "is now loaded");
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var markers = detector.detect(imageData);
                updateScenes(markers);
            };

            function updateScenes(markers) {
                var corners, corner, pose, i;

                if (markers.length > 0) {
                    corners = markers[0].corners;

                    for (i = 0; i < corners.length; ++i) {
                        corner = corners[i];

                        corner.x = corner.x - (canvas.width / 2);
                        corner.y = (canvas.height / 2) - corner.y;
                    }

                    pose = posit.pose(corners);

                    updateObject(validImage, pose.bestRotation, pose.bestTranslation, pose.bestError);

                } else {
                    console.log("No markers detected");
                }

            }

            function updateObject(object, rotation, translation, error) {
                var yaw = -Math.atan2(rotation[0][2], rotation[2][2]);
                var pitch = -Math.asin(-rotation[1][2]);
                var roll = Math.atan2(rotation[1][0], rotation[1][1]);
                object.rotationX = -Math.asin(-rotation[1][2]);
                object.rotationY = -Math.atan2(rotation[0][2], rotation[2][2]);
                object.rotationZ = Math.atan2(rotation[1][0], rotation[1][1]);

                object.positionX = translation[0];
                object.positionY = translation[1];
                object.positionZ = -translation[2];

                console.log(object.rotationX);
                console.log(object.rotationY);
                console.log(object.rotationZ);
                console.log(object.positionX);
                console.log(object.positionY);
                console.log(object.positionZ);
            }

            return validImage;
        }


        var validFiles = [];

        FS.Utility.eachFile(event, function (file) {
            var newFile = new FS.File(file);
            newFile.metadata = {
                title: "Hello",
                rotationX: "",
                rotationY: "",
                rotationZ: "",
                positionX: "",
                positionY: "",
                positionZ: ""
            };
            Images.insert(newFile, function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                console.log("Uploaded file");
            });
        });
    }
});