//http://meteorcapture.com/simple-search-pattern/
RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

//http://stackoverflow.com/questions/22418592/bootboxjs-how-to-render-a-meteor-template-as-dialog-body
renderTemplate = function (template, data) {
    var node = document.createElement("div");
    document.body.appendChild(node);
    UI.renderWithData(template, data, node);
    return node;
};