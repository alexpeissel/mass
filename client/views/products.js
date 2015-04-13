Template.productList.helpers({
    'products': function(){
        return Products.find();
    }
});

Tracker.autorun(function() {
    if (Session.get('productSearchQuery'))
        Meteor.subscribe('prductSearch', Session.get('productSearchQuery'));
});

Template.productSearch.events({
    'keyup [type=text]': function(event, template) {
        Session.set('productSearchQuery', event.target.value);
    }
});

Template.productSearch.helpers({
    searchResults: function() {
        return Products.search(Session.get('productSearchQuery'));
    },
    productSearchQuery: function() {
        return Session.get('productSearchQuery');
    }
});