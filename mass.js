if (Meteor.isClient) {


  Template.setup.rendered = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    script.src = "lib/arucoComp.js";

    var target = document.getElementsByTagName('script')[0];
    target.parentNode.insertBefore(script, target);
    console.log("Injected script");
  }

  Template.detector.events({
    'click': function () {
      console.log("You clicked something");

      canvas = document.getElementById("detectorCanvas");
      context = canvas.getContext("2d");
      canvas.width = parseInt(canvas.style.width);
      canvas.height = parseInt(canvas.style.height);

      var detector = new aruco.AR.Detector();
      posit = new POS.Posit(modelSize, canvas.width);
      console.log("Got here");

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
