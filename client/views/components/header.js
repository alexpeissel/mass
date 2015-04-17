if (Meteor.isClient) {

    Template.header.helpers({
        currentProduct: function () {
            return Session.get("currentProduct");
        },

        currentProduct: function () {
            return Session.get("currentImage");
        }
    });
}
