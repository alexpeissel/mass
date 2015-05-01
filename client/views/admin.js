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
