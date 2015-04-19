Template.uploader.events({
    'change #fileInput': function (event, template) {
        console.log("Starting upload");

        //set up detector canvas
        var tempCanvas = document.getElementById("detectorCanvas");

        var fileList = $('input[type="file"]').get(0).files;

        function upload(file, metadata){
            var newFile = new FS.File(file);
            newFile.metadata = metadata;

            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            Images.insert(newFile, function (err, fileObj) {
                console.log("Uploaded file");
            });
        }

        function setupReader(file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log("File: " + file.name + " size: " + (file.size / 1024));

                // get file content
                var imageData = e.target.result;

                var img = new Image;
                img.onload = function () {
                    Session.set("isUploading", true);
                    try {
                        console.log("Image loaded with width: " + img.width + " and height: " + img.height);
                        scannedImage = detectMarker(img, tempCanvas);

                        upload(file, scannedImage);
                    } catch (error){
                        Session.set("isUploading", false);
                        alert(error);
                    }
                    Session.set("isUploading", false);
                };
                img.src = imageData;

            };
            reader.readAsDataURL(file);
        }

        for (var i = 0; i < fileList.length; i++) {
            setupReader(fileList[i]);
        }

        function detectMarker(img, canvas) {

            var context = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            console.log("Canvas " + canvas.id + " found with width: " + canvas.width + " Height: " + canvas.height);

            var modelSize = 35.0; //millimeters

            var validImage = {
                rotation: {
                    x: null,
                    y: null,
                    z: null
                },

                position: {
                    x: null,
                    y: null,
                    z: null
                }
            };

            console.log("Initilizing detectors");
            detector = new AR.Detector();
            posit = new POS.Posit(modelSize, canvas.width);

            console.log("Drawing image " + img.name + " to canvas " + canvas.id);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

                console.log("Canvas " + canvas.id + "is now loaded");
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var markers = detector.detect(imageData);
                updateScenes(markers);

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
                    console.log("No markers detected in image");
                }

            }

            function updateObject(object, rotation, translation, error) {
                //var yaw = -Math.atan2(rotation[0][2], rotation[2][2]);
                //var pitch = -Math.asin(-rotation[1][2]);
                //var roll = Math.atan2(rotation[1][0], rotation[1][1]);
                object.rotation.x = -Math.asin(-rotation[1][2]);
                object.rotation.y = -Math.atan2(rotation[0][2], rotation[2][2]);
                object.rotation.z = Math.atan2(rotation[1][0], rotation[1][1]);

                object.position.x = translation[0];
                object.position.y = translation[1];
                object.position.z = -translation[2];

                console.log(object.rotation.x);
                console.log(object.rotation.y);
                console.log(object.rotation.z);
                console.log(object.position.x);
                console.log(object.position.y);
                console.log(object.position.z);
            }

            return validImage;
        }

    }
});