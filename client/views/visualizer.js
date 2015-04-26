Template.visualizer.helpers({
   renderedImage: function(){
       return Session.get("imageData");
   },

    data: function() {

    }
});

Template.visualizer.events({
    "click #viewportCanvas": function () {
        var canv = document.getElementById("viewportCanvas");
        var img = new Image();

        var div = document.getElementById('foo');

        img.onload = function() {
            div.appendChild(img);
        };

        img.src = canv.toDataURL();
    }
});