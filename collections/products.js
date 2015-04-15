Products = new  Mongo.Collection("products");

function addInitalData() {
    if (Products.find().count() === 0) {
        console.log("Adding inital data");

        for (var i = 0; i < 10; i++) {
            console.log(i + ' doc indexed');
            brands = ["Sony", "Panasonic", "Apple", "Philips"];
            models = ["10000", "a-tron", "Atomic", "Laserdisk", "Watch", "Blast", "Device"]
            Products.insert({
                name: randElement(brands) + " " + randElement(models),
                createdAt: new Date().getTime(),
                description: "This text is now going to be very long.  Descriptive text goes here for product #" + i,
                link: "http://www.google.com",
                price: "10.99",
                image: null,
                model: null
            });
        }

        console.log('done!');
    }
}

function randElement(arr){
    return arr[Math.floor(Math.random() * brands.length)];
}

Products.search = function(query) {
    return Products.find({
        name: { $regex: RegExp.escape(query), $options: 'i' }
    }, {
        limit: 50
    });
};

if(Meteor.isServer){
    Meteor.publish("products", function () {
        return Products.find();
    });

    Meteor.publish('productSearch', function(query) {
        check(query, String);

        if (_.isEmpty(query))
            return this.ready();

        return Products.search(query);
    });

    addInitalData();

}else{
    Meteor.subscribe("products");
}