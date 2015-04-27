/*
    Declare all URL patterns and their target templates
 */

Router.route('/', function () {
    this.render('home');
});

Router.route('/gallery', function () {
    this.render('galleryPage');
});

Router.route('/vis/:storeid/:prodid', function () {
    Session.set("productSearchQuery", this.params.prodid);
    console.log(this.params.prodid);
    this.render('galleryPage');
});

Router.route('/products', function () {
    this.render('productsPage');
});

Router.route('/search/prod/:term', function () {
    Session.set("productSearchQuery", this.params.term);
    console.log(this.params.query);
    this.render('productsPage');
});

Router.route('/admin', function () {
    this.render('adminPage');
});