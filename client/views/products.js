Template.productList.helpers({
    'products': function(){
        return Products.find();
    }
});

Template.product.events({
   'click .btn': function(e){
       var clickedButton = e.currentTarget;
       //alert( $(clickedButton).val() );
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
                       //take some actions
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
        Meteor.subscribe('prductSearch', Session.get('productSearchQuery'));
});

Template.productList.rendered = function(){
    return Products.find();
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