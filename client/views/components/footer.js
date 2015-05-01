if (Meteor.isClient) {

    Template.footer.helpers({
        currentProduct: function () {
            return Session.get("currentProduct") ? Products.findOne({_id: Session.get("currentProduct")}).name : "None";
        },

        currentImage: function () {
            return Session.get("currentImage");
        },

        status: function () {
            if (Session.get("isUploading")){
                console.log("is uploading")
            } else {
                console.log("not uploading");
            }
            return Session.get("isUploading")

        }
    });

    Template.footer.events({
        "click .clearProduct": function() {
                Session.set("currentProduct", "");
        },

        "click .dashupload": function() {
            alert("clicked");
            $(".uploader").trigger("change");
        }
    });
}
