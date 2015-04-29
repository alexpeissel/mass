Template.home.rendered = function () {
    if (Session.get("unauthorized")) {
        sAlert.error("You do not have sufficiant privilages to see this page :(", {
            effect: 'scale',
            position: 'bottom-right',
            timeout: '5000'
        });
        Session.set("unauthorized", false);
    }
};