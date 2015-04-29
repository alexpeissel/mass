if (Meteor.isClient) {
    Meteor.startup(function () {
        sAlert.config({
            effect: 'scale',
            position: 'top-right',
            timeout: 5000
        });
    });
}

