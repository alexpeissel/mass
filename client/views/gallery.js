//http://stackoverflow.com/questions/19865537/three-js-set-background-image
//http://blog.romanliutikov.com/post/58690562825/external-models-in-three-js
//http://www.html5canvastutorials.com/three/html5-canvas-webgl-rotating-cube/

Template.photoTile.events({
    'click': function () {
        var currentImage = this._id;
        Session.set("currentImage", Images.findOne({_id: currentImage})._id);
        bootbox.dialog({
            title: 'View image',
            message: renderTemplate(Template.viewport),
            buttons: {
                close: {
                    label: "Close",
                    className: "btn btn-primary",
                    callback: function () {
                        //take some actions
                    }
                },

                vendor: {
                    label: "Visit sellers site <h1>derp</h1>",
                    className: "btn btn-primary",
                    callback: function () {

                    }
                },

                delete: {
                    label: "Delete",
                    className: "btn btn-danger",
                    callback: function () {
                        console.log(this._id);
                        Images.remove(this._id);
                    }
                }
            }
        });

    }

});

Template.images.helpers({
    images: function () {
        return Images.find();
    }

});

Template.galleryPage.rendered = function () {
  if (Session.get("changedProduct")) {
      sAlert.success(Products.findOne({_id: Session.get("currentProduct")}).name + " is ready to view!", {effect: 'scale', position: 'bottom-right', timeout: '5000'});
      Session.set("changedProduct", false)
  }
};
