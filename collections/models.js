FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
]);

//Create the master store
var modelStore = new FS.Store.GridFS("jsonModels");

Models = new FS.Collection("models", {
    stores: [modelStore],
    filter: {
        maxSize: 10485760, //in bytes
        allow: {
            //contentTypes: ['application/json'],
            //extensions: ['.js', '.json']
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

function addInitalData() {
    if (Models.find().count() === 0) {
        console.log("Adding inital data");

        for (var i = 0; i < 1; i++) {
            console.log(i + ' doc indexed');
            Models.insert({
                name: "car",
                createdAt: new Date().getTime(),
                active: true,
                modelData: ""
            });
        }

        console.log('done!');
    }
}

if(Meteor.isServer){
    Meteor.publish("models", function () {
        return Models.find();
    });

    //addInitalData();

}else {
    Meteor.subscribe("models");
}