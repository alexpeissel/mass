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
            image: "/inital/lack/lack.jpg",
            model: "/inital/lack/lack.js",
            textures: []
        },

        {
            name: "Apple iMac (2006)",
            createdAt: new Date().getTime(),
            description: "",
            link: "http://www.ikea.com/gb/en/catalog/products/80111339/",
            price: "16",
            image: "/inital/lack/lack.jpg",
            model: "/inital/lack/lack.js",
            textures: []
        },

        {
            name: "Ikea Lack",
            createdAt: new Date().getTime(),
            description: "Separate shelf for magazines, etc. helps you keep your things organised and the table top clear.",
            link: "http://www.ikea.com/gb/en/catalog/products/80111339/",
            price: "16",
            image: "/inital/lack/lack.jpg",
            model: "/inital/lack/lack.js",
            textures: []
        }

    ];

    for (var i = 0; i < 10; i++) {
        console.log(i + " product generated");
        brands = ["Sony", "Panasonic", "Apple", "Philips"];
        names = ["10000", "a-tron", "Atomic", "Laserdisk", "Watch", "Blast", "Device"];
        Products.insert({
            name: randElement(brands) + " " + randElement(names),
            createdAt: new Date().getTime(),
            description: "This text is now going to be very long.  Descriptive text goes here for product #" + i,
            link: "http://www.google.com",
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
            // Need _id of existing user record so this call must come
            // after `Accounts.createUser` or `Accounts.onCreate`
            Roles.addUsersToRoles(id, user.roles);
        }
    });
    console.log("done!");
}