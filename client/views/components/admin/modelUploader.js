Template.modelUploader.events({
    'change .modelUploadForm': function () {
        console.log(currentProduct);

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
        Products.update({_id: currentProduct._id}, currentProduct);
        console.log(model);

        if (model) {
            if (textures.length > 0) {
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
                            //alert(processed.split(/\r\n|\r|\n/).length);
                            console.log(processed);

                            var updatedModel = new Blob([processed], {type: "application/x-javascript"});
                            updatedModel.lastModifiedDate = new Date();
                            updatedModel.name = "test.js";

                            var fileObj = productModels.insert(updatedModel);
                            currentProduct.model = fileObj;
                            console.log(currentProduct.model);
                            Products.update({_id: currentProduct._id}, {$set: {model: fileObj}});
                            //Products.insert({_id: currentProduct._id}, currentProduct);

                        }

                    }
                };
                reader.readAsText(model);
            } else {
                var fileObj = productModels.insert(model);
                Products.update({_id: currentProduct._id}, {$set: {model: fileObj}});
            }
        } else {
            console.log("No bleedin' model!")
        }
    }
});