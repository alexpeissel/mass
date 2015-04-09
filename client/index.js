if (Meteor.isClient) {

  //http://stackoverflow.com/questions/22418592/bootboxjs-how-to-render-a-meteor-template-as-dialog-body
  renderTemplate = function (template, data) {
    var node = document.createElement("div");
    document.body.appendChild(node);
    UI.renderWithData(template, data, node);
    return node;
  };

  Template.detector.rendered = function(){
    console.log("rendered canvas");
    var canvas = document.getElementById("detectorCanvas");
    var context = canvas.getContext("2d");

    var image = new Image();
    image.src = this.url;
    //console.log(this);

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

 Template.photoTile.events({
   'click': function () {
     console.log(this);
       bootbox.dialog({
         title: 'View image',
         message: renderTemplate(Template.detector),
         buttons: {
           close: {
             label: "Close",
             className: "btn btn-primary",
             callback: function() {
               //take some actions
             }
           },

           visualise: {
             label: "Visualise",
             className: "btn btn-primary",
             callback: function() {
                //take some actions
             }
           },

            delete: {
              label: "Delete",
              className: "btn btn-danger",
              callback: function() {
                console.log(this._id);
                Images.remove(this._id);
              }
           }
         }
       });
       Blaze.render(Template.detector,$("#detectorNode")[0]);
     }
 });

  Template.detector.events({
    'click': function () {

      canvas = document.getElementById("detectorCanvas");
      context = canvas.getContext("2d");
      canvas.width = parseInt(canvas.style.width);
      canvas.height = parseInt(canvas.style.height);
      console.log("Canvas found with width: " + canvas.width + " Height: " + canvas.height);

      var modelSize = 35.0; //millimeters

      var validImage = {
        imageData: "dataGoesHere",
        rotationX: null,
        rotationY: null,
        rotationZ: null,
        positionX: null,
        positionY: null,
        positionZ: null
      }

      detector = new AR.Detector();
      posit = new POS.Posit(modelSize, canvas.width);

      var image = new Image();
      image.src = "/images/pic1.jpg";

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      var markers = detector.detect(imageData);
      updateScenes(markers);

      function updateScenes(markers){
        var corners, corner, pose, i;

        if (markers.length > 0){
          corners = markers[0].corners;

          for (i = 0; i < corners.length; ++ i){
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

    }
  });

  Template.uploader.events({
    'change #fileInput': function(event, template) {
     console.log("Registered upload");
      FS.Utility.eachFile(event, function(file) {
        var newFile = new FS.File(file);
        file.metadata = {
          title: "",
          rotationX: "",
          rotationY: "",
          rotationZ: "",
          positionX: "",
          positionY: "",
          positionZ: ""
        };
        Images.insert(file, function (err, fileObj) {
          // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
          console.log("Uploaded file: " + file.name);
        });
      });
    }
  });

  Template.detector.helpers({
    currentImage: function () {
      return Images.find(this._id);
    },

    log: function () {
      console.log(this);
    }
  });

  Template.images.images = function() {
    return Images.find();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });

  Meteor.methods({
    // methods go here
  });
}
