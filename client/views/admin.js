Template.productDashboard.helpers({
    products: function () {
        //where user.type = business + business ID
        return Products.find();
    },

    activeModel: function (){
        if (this.model) {
            return this.model
        } else {
            return "Model"
        }

    },

    activeImage: function (){
        if (this.image) {
            return this.image
        } else {
            return "Image"
        }
    }
});

Template.productDashboard.events({
    "click .edit": function () {
        Session.set("editingProduct", this._id);

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
                        var converted = csvToObject($('.csvInputTextbox').val());
                        if (Session.get("editingProduct")) {
                            bootbox.confirm(
                                "Change product to attributes: " +
                                "name: \"" + converted.name +
                                "\", description: \"" + converted.description +
                                "\", price: \"" + converted.price +
                                "\", link: \"" + converted.link +
                                "\", image: \"" + converted.image +
                                "\", model: \"" + converted.model + "\"?",
                                function (result) {
                                    if (result) {
                                        Products.update({_id: Session.get("editingProduct")}, converted);
                                    }
                                });

                        } else {
                            bootbox.confirm(
                                "Add product with attributes: " +
                                "name: \"" + converted.name +
                                "\", description: \"" + converted.description +
                                "\", price: \"" + converted.price +
                                "\", link: \"" + converted.link +
                                "\", image: \"" + converted.image +
                                "\", model: \"" + converted.model + "\"?",
                                function (result) {
                                    if (result) {
                                        Products.insert(converted);
                                    }
                                });
                        }
                    }
                }
            }
        });
    },

    "click .delete": function () {
        //'this' changes scope when called from inside the bootbox call, hence the thisProduct var to preserve it
        var thisProduct = this._id;
        var product = Products.findOne({_id: thisProduct}).name;

        bootbox.confirm("Are you sure to want to delete " + product + " ?", function (result) {
            if (result) {
                Products.remove({_id: thisProduct});
            }
        });
    }
});

Template.csvInput.helpers({
    csvPlaceholder: function () {
        // Slice removes _id field
        var keys = Object.keys(Products.findOne({})).slice(1);
        return keys.join(', ');

    }
});

Template.csvInput.rendered = function () {
    var productData = _.values(Products.findOne({_id: Session.get("editingProduct")}, {fields: {'createdAt': 0}})).slice(1).join(",");
    $('.csvInputTextbox').val(productData);
    Session.set("editProduct", "");
};

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

function csvToObject(data) {
    var parsedData = Papa.parse(data);

    var preparedObject = {
        name: null,
        description: null,
        price: null,
        link: null,
        image: null,
        model: null
    };

    if (parsedData.errors.length > 0) {
        alert("An error occured during import: " + parsedData.errors[0].join(','));
    } else if (parsedData.data[0].length != _.keys(preparedObject).length) {
        alert(
            "Incorrect number of fields in string: " +
            parsedData.data[0].length + " instead of " +
            _.keys(preparedObject).length
        );
    } else {
        preparedObject.name = parsedData.data[0][0];
        preparedObject.description = parsedData.data[0][1];
        preparedObject.price = parsedData.data[0][3];
        preparedObject.link = parsedData.data[0][2];
        preparedObject.image = parsedData.data[0][4];
        preparedObject.model = parsedData.data[0][5];
    }
    console.log(preparedObject);
    return preparedObject;
}

