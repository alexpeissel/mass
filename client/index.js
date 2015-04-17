if (Meteor.isClient) {

    Template.detector.rendered = function () {
        console.log("rendered canvas");
        var canvas = document.getElementById("detectorCanvas");
        var context = canvas.getContext("2d");

        var image = new Image();
        image.src = this.url;
        //console.log(this);

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

}

if (Meteor.isServer) {
    Meteor.startup(function () {

    });

    Meteor.methods({
        // methods go here
    });
}
