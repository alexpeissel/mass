if (Meteor.isClient) {


  Template.setup.rendered = function() {
    //var script = document.createElement('script');
    //script.type = 'text/javascript';
    //script.async = true;
    //
    //script.src = "lib/aruco.js";
    //
    //var target = document.getElementsByTagName('script')[0];
    //target.parentNode.insertBefore(script, target);
    //console.log("Injected script");
  }

  Template.detector.events({
    'click': function () {
      console.log("You clicked something");

      //var canvas = document.getElementById("detectorCanvas");
      //var context = canvas.getContext("2d");
      //var canvas.width = parseInt(canvas.style.width);
      //var canvas.height = parseInt(canvas.style.height);

      CV.BlurStack();
      detector = new AR.Detector();
      posit = new POS.Posit(modelSize, canvas.width);

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
