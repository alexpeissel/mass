Products = new  Mongo.Collection("products");

var modelStore = new FS.Store.GridFS("modelStore", {
});

var textureStore = new FS.Store.GridFS("textureStore");

var prodThumbStore = new FS.Store.GridFS("prodThumbStore", {
    transformWrite: function(fileObj, readStream, writeStream) {
        gm(readStream, fileObj.name)
            .resize(270,220,"^")
            .gravity('Center')
            .crop(270, 220)
            .quality(100)
            .autoOrient()
            .stream()
            .pipe(writeStream);
    }
});

productModels = new FS.Collection("productModels", {
    stores: [modelStore]
});

productTextures = new FS.Collection("productTextures", {
    stores: [textureStore]
});

productThumbs = new FS.Collection("productThumbs", {
    stores: [prodThumbStore],
    filter: {
        maxSize: 10485760, //in bytes
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png', 'jpg', 'jpeg', 'gif']
        },
        onInvalid: function (message) {
            if(Meteor.isClient){
                alert(message);
            }else{
                console.warn(message);
            }
        }
    }
});

productModels.allow({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    download: function () {
        return true;
    }
});

Products.search = function(query) {
    return Products.find({
        name: { $regex: RegExp.escape(query), $options: "i" }
    }, {
        limit: 50
    });
};

if(Meteor.isServer){
    Meteor.publish("products", function () {
        return Products.find();
    });

    Meteor.publish("productSearch", function(query) {
        check(query, String);

        if (_.isEmpty(query))
            return this.ready();

        return Products.search(query);
    });

}else{
    Meteor.subscribe("products");
}