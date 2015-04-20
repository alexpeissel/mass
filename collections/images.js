//Set Cache Control headers so we don't overload our meteor server with http requests
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
]);

FS.debug = true;

//Create the master store
var masterStore = new FS.Store.GridFS("master");

//Create a thumbnail store
var thumbnailStore = new FS.Store.GridFS("thumbnail", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {
        /* Use graphicsmagick to create a 300x300 square thumbnail at 100% quality,
         * orient according to EXIF data if necessary and then save by piping to the
         * provided writeStream */
        gm(readStream, fileObj.name)
            .resize(300,300,"^")
            .gravity('Center')
            .crop(300, 300)
            .quality(100)
            .autoOrient()
            .stream()
            .pipe(writeStream);
    }
});

//Create globally scoped Images collection.
Images = new FS.Collection("images", {
    stores: [thumbnailStore, masterStore],
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


//Use allow to control insert, update, remove and download. In this case we will just allow them all.
Images.allow({
    insert: function(userId, file) {
        return true;
    },
    update: function(userId, file, fields, modifier) {
        return true;
    },
    remove: function(userId, file) {
        return true;
    },
    download: function() {
        return true;
    }
});


//If we're on the server publish the collection, otherwise we are on the client and we should subscribe to the publication.
if(Meteor.isServer){

    Meteor.publish('images', function () {
        return Images.find();

    });

}else{
    Meteor.subscribe('images');
}