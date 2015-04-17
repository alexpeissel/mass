if (Meteor.isClient) {

    Template.footer.helpers({
        currentProduct: function () {
            return Session.get("currentProduct");
        },

        currentImage: function () {
            return Session.get("currentImage");
        }
    });
}
