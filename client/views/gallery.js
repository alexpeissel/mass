//http://stackoverflow.com/questions/19865537/three-js-set-background-image
//http://blog.romanliutikov.com/post/58690562825/external-models-in-three-js
//http://www.html5canvastutorials.com/three/html5-canvas-webgl-rotating-cube/

Template.photoTile.events({
    'click': function () {
        var currentImage = this._id;
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

                visualise: {
                    label: "Visualise",
                    className: "btn btn-primary",
                    callback: function () {
                        Session.set("currentImage", Images.findOne({_id: currentImage})._id);
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
    },

    shortName: function (name) {
        var maxLength = 12;
        if (name.length > maxLength) {
            return name.substring(0, maxLength) + "...";
        } else {
            return name;
        }

}

});
