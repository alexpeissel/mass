if (Meteor.isClient) {

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        sAlert.config({
            effect: 'scale',
            position: 'top-right',
            timeout: 5000
        });
    });

    Meteor.methods({
        // methods go here
    });
}
