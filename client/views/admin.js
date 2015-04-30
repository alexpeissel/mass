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
                        if (!converted) {
                            return false;
                        } else {
                            if (Session.get("editingProduct")) {
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
            message: renderTemplate(Template.modelUpload),
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
    var currentProduct = Products.findOne({_id: Session.get("editingProduct")});
    var productData = [currentProduct.name, currentProduct.description, currentProduct.price, currentProduct.link].join(",");
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

Template.textureUpload.events({
    'change .textureUploadForm': function () {
        var currentProduct = Products.findOne({_id: Session.get("editingProduct")});
        var fileList = $('.textureUploadForm').get(0).files;

        var texturePack = [];

        for (var i = 0; i < fileList.length; i++) {
            var fileObj = productTextures.insert(fileList[i]);
            texturePack.push(fileObj);
        }

        currentProduct.textures = texturePack;
        Products.update({_id: currentProduct._id}, currentProduct);

    }
});

//Template.productImport.events({
//    'change .productImporter': function (event, template) {
//        var file = $('.productImporter').get(0).files[0];
//        var fileObj = Models.insert(file);
//        Products.insert({
//            name: "test",
//            model: fileObj
//        });
//    }
//});

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
        if (Products.findOne({_id: Session.get("editingProduct")}).image) {
            preparedObject.image = Products.findOne({_id: Session.get("editingProduct")}).image;
        } else {
            preparedObject.image = null;
        }

        if (Products.findOne({_id: Session.get("editingProduct")}).model) {
            preparedObject.model = Products.findOne({_id: Session.get("editingProduct")}).model;
        } else {
            preparedObject.model = null;
        }
        preparedObject.texture = null;
        preparedObject.owner = Meteor.userId();

    }
    console.log(preparedObject);
    return preparedObject;
}

Template.modelUpload.events({
    'change .modelUploadForm': function () {

        var currentProduct = Products.findOne({_id: Session.get("editingProduct")});
        var fileList = $('.modelUploadForm').get(0).files;

        var imageExtensions = [".jpg", ".jpeg", ".png"];
        var modelExtensions = [".js"];

        var textures = [];
        var model;

        for (var i = 0; i < fileList.length; i++) {
            var extension = fileList[i].name.substring(fileList[i].name.lastIndexOf('.'));

            if (imageExtensions.indexOf(extension) >= 0) {
                textures.push(fileList[i]);
            } else if (modelExtensions.indexOf(extension) >= 0) {
                model = fileList[i];
            }
        }

        console.log(model);

        if (textures.length >= 1) {
            for (var j = 0; j < textures.length; j++) {
                var fileObj = productTextures.insert(textures[j]);
                textures[j] = fileObj;
            }
        }

        currentProduct.textures = textures;
        console.log(model);

        if (model) {
            if (textures.length >= 1) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var content = e.target.result;

                    for (var k = 0; k < textures.length; k++) {
                        console.log(textures);
                        console.log("Texture available: " + textures[k].original.name);

                        if (content.search(textures[k].original.name) <= 0) {
                            console.log("No reference found");
                        } else {
                            console.log("Found texture referance at: " + content.search(textures[k].original.name));
                            console.log("Setting " + textures[k].original.name + " to " + textures[k]._id);

                            var idString = ": \"" + textures[k]._id;
                            var processed = content.replace(/: ".*jpg|jpeg|png"/i, idString);

                            var updatedModel = new Blob([processed], {type: "text/plain"});
                            updatedModel.lastModifiedDate = new Date();
                            updatedModel.name = "dog.js";

                            var fileObj = productTextures.insert(updatedModel);
                            currentProduct.model = fileObj;
                            Products.update({_id: currentProduct._id}, currentProduct);
                        }

                    }
                };
                reader.readAsText(model);
            } else {
                currentProduct.model = model;
                Products.update({_id: currentProduct._id}, currentProduct);
            }
        } else {
            console.log("No bleedin' model!")
        }
    }
});
