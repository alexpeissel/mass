/*
 Declare all URL patterns and their target templates
 */

Router.route("/", function () {
    this.render("productsPage");
});

Router.route("/gallery", function () {
    this.render("galleryPage");
});

Router.route("/vis/:prodId", function () {
    console.log(Products.findOne({_id: this.params.prodId}));
    if (Products.findOne({_id: this.params.prodId})) {
        Session.set("currentProduct", this.params.prodId);
        Session.set("changedProduct", true);
        this.render("galleryPage");
    } else {
        this.render("productsPage");
    }
});

Router.route("/products", function () {
    this.render("productsPage");
});

Router.route("/products/:prodId", function () {
    if (Products.findOne({_id: this.params.prodId})) {
        Session.set("productSearchQuery", Products.findOne({_id: this.params.prodId}).name);
    }
    this.render("productsPage");
});

Router.route("/store/:storeName/*", function () {
    if (Meteor.users.findOne({username: this.params.storeName})) {
        Session.set("currentStore", this.params.storeName);
    }
    this.render("productsPage");
});

Router.route("/search/prod/:term", function () {
    Session.set("productSearchQuery", this.params.term);
    this.render("productsPage");
});

Router.route("/admin", function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        this.render("adminPage");
    } else {
        Session.set("unauthorized", true);
        this.render("galleryPage");
    }
});

Router.map(function() {
    this.route('zip', {
        where: 'server',
        path: 'zip',
        action: function() {
            var self = this;

            // Create zip
            var zip = new JSZip();

            var productList = Products.find().fetch();
            var header = ["name", "description", "price", "link"];
            var exportData = header;

            for (var i =0; i < productList.length; i++){

                    var row = [
                        productList[i].name,
                        productList[i].description,
                        productList[i].price,
                        productList[i].link
                    ];
                exportData += ("\n" + row);
            }

            // Add a file to the zip
            var filename = "export_" + new Date().getTime() + ".txt";

            zip.file("export_" + new Date() + ".txt", exportData);

            // Generate zip stream
            var output = zip.generate({
                type:        "nodebuffer",
                compression: "DEFLATE"
            });

            // Set headers
            self.response.setHeader("Content-Type", "application/octet-stream");
            self.response.setHeader("Content-disposition", "attachment; filename=filename.zip");
            self.response.writeHead(200);

            // Send content
            self.response.end(output);
        }
    });
});