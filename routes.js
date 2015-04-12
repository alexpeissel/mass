Router.route('/', function () {
    this.render('home');
});

Router.route('/gallery', function () {
    this.render('galleryPage');
});

Router.route('/products', function () {
    this.render('productsPage');
});