Template.productList.helpers({
    "products": function () {
        return Products.find();
    }
});

Template.product.events({
    "click .btn": function (e) {
        var clickedButton = e.currentTarget;
        Session.set("currentProduct", $(clickedButton).val());
        Session.set("changedProduct", true);
        Router.go('gallery');

    }
});

Template.product.helpers({
    "thumbURL": function (id) {

        if (!Products.findOne({_id: id}).image) {
            return "/images/placeholder.gif";
        } else {
            var imageId = Products.findOne({_id: id}).image._id;
            var modelURL = productThumbs.findOne({_id: imageId}).url();

            return modelURL;
        }
    }
});

Tracker.autorun(function () {
    if (Session.get('productSearchQuery'))
        Meteor.subscribe('productSearch', Session.get('productSearchQuery'));
});

Template.productSearch.rendered = function () {
    if (!Session.get("productSearchQuery")) {
        Session.set('productSearchQuery', "");
    }
};

Template.productSearch.events({
    'keyup [type=text]': function (event, template) {
        Session.set('productSearchQuery', event.target.value);
    }
});

Template.productSearch.helpers({
    searchResults: function () {
        return Products.search(Session.get('productSearchQuery'));
    },
    productSearchQuery: function () {
        return Session.get('productSearchQuery');
    }
});