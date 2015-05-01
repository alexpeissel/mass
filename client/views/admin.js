Template.productDashboard.helpers({
    products: function () {
        var loggedInUser = Meteor.user();
        if (Roles.userIsInRole(loggedInUser, ['admin'])) {
            return Products.find();
        } else {
            return Products.find({owner: loggedInUser});
        }
    },

    activeModel: function () {
        if (this.model) {
            return this.model.original.name
        } else {
            return "Model"
        }
    },

    activeImage: function () {
        if (this.image) {
            return this.image.original.name
        } else {
            return "Image"
        }
    }
});

Template.productDashboard.events({
    "click .edit": function () {

        if (this._id) {
            Session.set("editingProduct", this._id);
        } else {
            Session.set("editingProduct", "new");
        }

        bootbox.dialog({
            title: 'Add data in CSV format',
            message: renderTemplate(Template.csvInput),
            buttons: {
                close: {
                    label: "Close",
                    className: "btn btn-primary",
                    callback: function () {
                        return true;
                    }
                },

                submit: {
                    label: "Submit",
                    className: "btn btn-primary",
                    callback: function () {
                        var raw = $(".csvInputTextbox").val();
                        var converted = csvToObject(raw);

                        if (!converted) {
                            return false;
                        } else {
                            if (!Session.equals("editingProduct", "new")) {
                                bootbox.confirm(
                                    "Change product to attributes: " +
                                    "name: \"" + converted.name +
                                    "\", description: \"" + converted.description +
                                    "\", price: \"" + converted.price +
                                    "\", link: \"" + converted.link + "\"?",
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
                                    "\", link: \"" + converted.link + "\"?",
                                    function (result) {
                                        if (result) {
                                            Products.insert(converted);
                                        }
                                    });
                            }
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
    },

    "click .modelUpload": function () {
        Session.set("editingProduct", this._id);

        bootbox.dialog({
            title: "Upload model",
            message: renderTemplate(Template.modelUploader),
            buttons: {
                delete: {
                    label: "<span class=\"glyphicon glyphicon-remove\"></span> Delete",
                    className: "btn btn-danger",
                    callback: function () {

                    }
                }
            }
        });

    },

    "click .imageUpload": function () {
        Session.set("editingProduct", this._id);

        bootbox.dialog({
            title: "Upload product image",
            message: renderTemplate(Template.imageUpload),
            buttons: {
                delete: {
                    label: "<span class=\"glyphicon glyphicon-remove\"></span> Delete",
                    className: "btn btn-danger",
                    callback: function () {
                        var currentProductImage = Products.findOne({_id: editingProduct}).image._id;
                        prodThumbStore.remove({_id: editingProduct}, currentProductImage);
                    }
                },

                close: {
                    label: "Close",
                    className: "btn btn-default",
                    callback: function () {
                        return true;
                    }
                }
            }
        });

    }
});

Template.csvInput.rendered = function () {
    var productData;

    if (!Session.equals("editingProduct", "new")) {
        var currentProduct = Products.findOne({_id: Session.get("editingProduct")});
        productData = [currentProduct.name, currentProduct.description, currentProduct.price, currentProduct.link].join(",");
    } else {
        productData = ["name", "description", "price", "link"].join(",")
    }

    $('.csvInputTextbox').val(productData);
    Session.set("editProduct", "");
};

Template.imageUpload.events({
    'change .imageUploadForm': function () {
        var currentProduct = Products.findOne({_id: Session.get("editingProduct")});
        var file = $('.imageUploadForm').get(0).files[0];

        var fileObj = productThumbs.insert(file);
        currentProduct.image = fileObj;

        Products.update({_id: currentProduct._id}, currentProduct);

    }
});

Template.productUpload.events({
    'change .productImporter': function () {
        var file = $('.productImporter').get(0).files[0];

        Papa.parse(file, {
            complete: function(results) {
                console.log(results);

                function PreparedObject(name, description, price, link, image, model, owner) {
                    this.name = name,
                        this.description = description,
                    this.price = price,
                    this.link = link,
                    this.image = image,
                    this.model = model,
                    this.owner = owner
                }

                for (var i = 0; i < results.data.length; i++){
                    var newProduct = new PreparedObject(
                        results.data[i][0],
                        results.data[i][1],
                        results.data[i][2],
                        results.data[i][3],
                        null,
                        null,
                        null,
                        Meteor.userId()
                    );

                    console.log("Adding product: " + newProduct.name);
                    Products.insert(newProduct);
                }
            }
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
        model: null,
        owner: null
    };

    if (parsedData.errors.length > 0) {
        alert("An error occured during import: " + parsedData.errors[0].join(','));
        return null;
    } else if (parsedData.data[0].length != 4) {
        alert(
            "Incorrect number of fields in string: " +
            parsedData.data[0].length + " instead of " +
            _.keys(preparedObject).length
        );
        return null;
    } else {
        preparedObject.name = parsedData.data[0][0];
        preparedObject.description = parsedData.data[0][1];
        preparedObject.price = parsedData.data[0][2];
        preparedObject.link = parsedData.data[0][3];

        //Preserve data from previous version
        if (!Session.equals("editingProduct", "new")) {
            preparedObject.image = Products.findOne({_id: Session.get("editingProduct")}).image;
        }

        if (!Session.equals("editingProduct", "new")) {
            preparedObject.model = Products.findOne({_id: Session.get("editingProduct")}).model;
        }

        if (!Session.equals("editingProduct", "new")) {
            preparedObject.textures = Products.findOne({_id: Session.get("editingProduct")}).textures;
        }

        preparedObject.owner = Meteor.userId();

    }
    console.log(preparedObject);
    return preparedObject;
}

