Template.productDashboard.helpers({
    products: function () {
        //where user.type = business + business ID
        return Products.find();
    }
});

Template.productDashboard.events({
    "click .btn": function () {
        bootbox.dialog({
            title: 'Add data in CSV format',
            message: renderTemplate(Template.csvInput),
            buttons: {
                close: {
                    label: "Close",
                    className: "btn btn-primary",
                    callback: function () {
                        //take some actions
                    }
                },

                submit: {
                    label: "Submit",
                    className: "btn btn-primary",
                    callback: function () {
                        //take some actions
                    }
                }
            }
        });
    }
});

Template.csvInput.helpers({
   csvPlaceholder: function() {
       // Slice removes _id field
       var keys = Object.keys(Products.findOne({})).slice(1);
       return keys.toString();

   }
});