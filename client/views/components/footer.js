if (Meteor.isClient) {

    Template.footer.helpers({
        currentProduct: function () {
            return Session.get("currentProduct");
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
}
