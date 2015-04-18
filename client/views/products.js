Template.productList.helpers({
    'products': function(){
        return Products.find();
    }
});

Template.product.events({
   'click .btn': function(e){
       var clickedButton = e.currentTarget;
       //alert( $ );
       bootbox.dialog({
           title: 'View image',
           message: $(clickedButton).val(),
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
                       var product = $(clickedButton).val();
                       Session.set("currentProduct", Products.findOne({_id: product}, {fields: {name:1}}).name);
                       console.log(Products.findOne({_id: product}, {fields: {name:1}}).name);

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

Tracker.autorun(function() {
    if (Session.get('productSearchQuery'))
        Meteor.subscribe('productSearch', Session.get('productSearchQuery'));
});

Template.productSearch.rendered = function(){
    Session.set('productSearchQuery', "");
}

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