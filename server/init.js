Meteor.startup(function () {
    if (Meteor.isServer) {

        if (Meteor.users.find().count() == 0) {
            addInitalUsers();
        }

        if (Products.find().count() === 0) {
            addInitalProducts();
        }
    }
});

function addInitalProducts() {

    console.log("Adding inital product data");

    var products = [
        {
            name: "Ikea Lack",
            createdAt: new Date().getTime(),
            description: "Separate shelf for magazines, etc. helps you keep your things organised and the table top clear.",
            link: "http://www.ikea.com/gb/en/catalog/products/80111339/",
            price: "16",
            image: "http://localhost:8000/inital/lack/lack.jpg",
            model: "http://localhost:8000/inital/lack/model/lack.js",
            textures: []
        }
    ];

    //_.each(products, function(product) {
    //    console.log("Adding:" +  product.name);
    //
    //    Products.insert(product);
    //    var imageUrl = product.image;
    //    Products.update({_id: product.id}, {image: productThumbs.insert(imageUrl)});
            //productThumbs.insert(product.image),
            //productModels.insert(product.model),
            //product.textures

        //product.model = ;
        //product.textures = _.each(product.textures, function(texture) {
        //    productTextures.insert(texture);
        //});
    //});

    for (var i = 0; i < 2; i++) {
        console.log(i + " product generated");
        brands = ["Sony", "Panasonic", "Apple", "Philips"];
        names = ["10000", "a-tron", "Atomic", "Laserdisk", "Watch", "Blast", "Device"];
        Products.insert({
            name: randElement(brands) + " " + randElement(names),
            createdAt: new Date().getTime(),
            description: "This is an example product!.  Add more through 'Admin'.  Put your descriptive text here for product #" + i,
            link: "/",
            price: "10.99",
            image: null,
            model: null,
            textures: []
        });
    }
    console.log("done!");
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function addInitalUsers() {

    console.log("Adding inital user data");

    var users = [
        {name: "Test user", email: "test@example.com", roles: []},
        {name: "Business User", email: "test@business.com", roles: ['business']},
        {name: "Admin User", email: "admin@example.com", roles: ['admin']}
    ];

    _.each(users, function (user) {

        console.log("Adding user: " + user.name);

        var id;

        id = Accounts.createUser({
            email: user.email,
            password: "test",
            profile: {name: user.name}
        });

        if (user.roles.length > 0) {
            Roles.addUsersToRoles(id, user.roles);
        }
    });
    console.log("done!");
}