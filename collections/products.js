Products = new  Mongo.Collection("products");

function addInitalData() {
    if (Products.find().count() === 0) {
        console.log("Adding inital data");

        for (var i = 0; i < 10; i++) {
            console.log(i + ' doc indexed');
            Products.insert({
                name: "Product #" + i,
                createdAt: new Date().getTime(),
                description: "This text is now going to super long.  Descriptive text goes here for product #" + i,
                link: "http://www.google.com",
                price: "10.99",
                image: null,
                model: null
            });
        }

        console.log('done!');
    }
}

if(Meteor.isServer){
    Meteor.publish("products", function () {
        return Products.find();
    });

    addInitalData();

}else{
    Meteor.subscribe("products");
}