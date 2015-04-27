//http://stackoverflow.com/questions/19865537/three-js-set-background-image
//http://blog.romanliutikov.com/post/58690562825/external-models-in-three-js
//http://www.html5canvastutorials.com/three/html5-canvas-webgl-rotating-cube/

Template.photoTile.events({
    'click': function () {
        var currentImage = this._id;
        Session.set("currentImage", Images.findOne({_id: currentImage})._id);

        var available = Session.get("currentProduct") ? "" : " disabled";

        bootbox.dialog({
            title: 'View image',
            message: renderTemplate(Template.viewport),
            buttons: {
                delete: {
                    label: "Delete",
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

                close: {
                    label: "Close",
                    className: "btn btn-primary",
                    callback: function () {
                        //take some actions
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

//$.each($(".thumbnail"), function( index, value ) {
//    $(this).animate({height: '300px', opacity: '0.4'}, "slow");
//});