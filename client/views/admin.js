Template.productDashboard.helpers({
    products: function () {
        //where user.type = business + business ID
        return Products.find();
    }
});

Template.productDashboard.events({
    "click .add": function () {
        bootbox.prompt({
            title: "Enter a CSV string",
            value: Object.keys(Products.findOne({})).slice(1).join(':"", '),
            callback: function (result) {
                if (result === null){
                    alert("prompt empty");
                } else {
                    try {
                        var preparedObject = {
                            name: null,
                            description: null,
                            link: null,
                            price: null,
                            image: null,
                            model: null
                        };

                        var parsedResults = Papa.parse(result);

                        //newprod, this is cool, http://google.com, 22, img, model

                        if (parsedResults.errors.length > 0){
                            alert("An error occured during import: " + parsedResults.errors);
                        } else if (parsedResults.data[0].length != _.keys(preparedObject).length) {
                            alert("Incorrect number of fields in string: " + parsedResults.data[0].length + " instead of " + _.keys(preparedObject).length);
                        } else {
                            preparedObject.name = parsedResults.data[0][0];
                            preparedObject.description = parsedResults.data[0][1];
                            preparedObject.link = parsedResults.data[0][2];
                            preparedObject.price = parsedResults.data[0][3];
                            preparedObject.image = parsedResults.data[0][4];
                            preparedObject.model = parsedResults.data[0][5];

                            Products.insert(preparedObject);
                        }

                    } catch (err) {
                        alert(err);
                    }

                }
            }
        });
    },

    "click .edit": function () {
        var thisProduct = this._id;
        var productData = _.values(Products.findOne({_id: thisProduct})).slice(1).join(", ");
        var test = {
            a: "b",
            b: "c",
            c: "d"
        };
        var results = Papa.parse("hello,my,name,is,bob");
        console.log(results);

        bootbox.dialog({
            title: 'Add data in CSV format' + productData,
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
                        //Products.insert({});
                    }
                }
            }
        });
    },

    "click .delete": function () {
        //'this' changes scope when called from inside the bootbox call, hence the thisProduct var to preserve it
        var thisProduct = this._id;
        var product = Products.findOne({_id: thisProduct}).name;

        bootbox.confirm("Are you sure to want to delete " + product + " ?", function(result) {
            if (result) {
                Products.remove({_id: thisProduct});
            }
        });
    }
});

Template.csvInput.helpers({
   csvPlaceholder: function() {
       // Slice removes _id field
       var keys = Object.keys(Products.findOne({})).slice(1);
       return keys.join(', ');

   }
});

Template.productImport.events({
    'change .productImporter': function (event, template) {
        var file = $('.productImporter').get(0).files[0];
        var fileObj = Models.insert(file);
        Products.insert({
            name: "test",
            model: fileObj
        });
    }
});
