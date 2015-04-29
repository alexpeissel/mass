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

shorten = function (data, length, preserveLength) {
    var defaultLength = 10;
    var defaultPreserved = 4;

    stringLength = length < defaultLength ? length : defaultLength;
    stringPreserved = preserveLength < defaultPreserved ? preserveLength : defaultPreserved;

    var stringEnd = data.substring(data.length - stringPreserved);
    var trimmedString = data.substring(0, stringLength)+ "... " + stringEnd;
    return trimmedString;
};