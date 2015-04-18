Template.header.helpers({
    active: function (routeName) {
        var currentPage = Router.current().route.getName();
        if(currentPage === routeName){
            return "active";
        } else {
            return "";
        }
    }

});

Template.header.events({
   "click a": function() {
       if($(".navbar-toggle").css("display") !="none"){
           $(".navbar-toggle").trigger("click");
       }
   }
});