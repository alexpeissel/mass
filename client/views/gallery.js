//http://stackoverflow.com/questions/19865537/three-js-set-background-image
//http://blog.romanliutikov.com/post/58690562825/external-models-in-three-js
//http://www.html5canvastutorials.com/three/html5-canvas-webgl-rotating-cube/

Template.photoTile.events({
    'click': function () {
        var currentImage = this._id;
        Session.set("currentImage", Images.findOne({_id: currentImage})._id);
        var currentImageName = this.original.name;

        var available = Session.get("currentProduct") ? "" : " disabled";

        if (!Session.get("currentProduct")) {
            alert("no prod");
        } else {
            var currentProductName = Products.findOne({_id: Session.get("currentProduct")}).name;

            bootbox.dialog({
                title: "Viewing " + currentImageName + " with a " + currentProductName,
                message: renderTemplate(Template.viewport),
                buttons: {
                    delete: {
                        label: "<span class=\"glyphicon glyphicon-remove\"></span> Delete",
                        className: "btn btn-danger",
                        callback: function () {
                            console.log(currentImage);
                            Images.remove(currentImage);
                        }
                    },

                    vendor: {
                        label: "<span class=\"glyphicon glyphicon-shopping-cart\"></span> Visit vendor",
                        className: "btn btn-primary" + available,
                        callback: function () {
                            var url = Products.findOne({_id: Session.get("currentProduct")}).link;
                            window.location = url;
                        }
                    },

                    save: {
                        label: "<span class=\"glyphicon glyphicon-download-alt\"></span> Save",
                        className: "btn btn-primary disabled",
                        callback: function () {
                            var canvas = document.getElementById('viewportCanvas');
                            data = canvas.toDataURL();
                            window.location = data;

                            //Prevents dialog from closing
                            return false;

                        }
                    },

                    close: {
                        label: "Close",
                        className: "btn btn-primary",
                        callback: function () {
                            return true;
                        }
                    },

                    //orient: {
                    //    label: "Orient",
                    //    className: "btn btn-primary",
                    //    callback: function () {
                    //        bootbox.dialog({
                    //            title: "Set orientation",
                    //            message: renderTemplate(Template.orienter),
                    //            buttons: {
                    //                save: {
                    //                    label: "<span class=\"glyphicon glyphicon-remove\"></span> Save",
                    //                    className: "btn btn-default",
                    //                    callback: function () {
                    //
                    //                    }
                    //                }
                    //            }
                    //        });
                    //    }
                    //},

                    scale: {
                        label: "Rescale",
                        className: "btn btn-primary",
                        callback: function () {
                            Session.set("updatedControls", true);
                            Session.set("control", "x");
                            return false;
                        }
                    }
                }
            });

        }
    }
});

Template.photoTile.helpers({
   "shortened": function (data) {
       return shorten(data);
   }
});

Template.images.helpers({
    images: function () {
        return Images.find();
    }

});

Template.galleryPage.rendered = function () {
    if (Session.get("changedProduct")) {
        sAlert.success(Products.findOne({_id: Session.get("currentProduct")}).name + " is ready to view!  Select an image to see the composed result.", {
            effect: 'scale',
            position: 'bottom-right',
            timeout: '5000'
        });
        $.each($(".thumbnail"), function (index, value) {
            $(this).delay(50 * index).animate({width: '+=20px', height: '+=20px'}, "fast");
            $(this).delay(50 * index).animate({width: '-=20px', height: '-=20px'}, "fast");

        });
        Session.set("changedProduct", false)
    }
};