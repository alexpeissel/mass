Package.describe({
  name: "js-aruco",
  summary: "AR library in pure JS",
  version: "0.1.3"
});

Package.on_use(function (api, where) {
  api.add_files('aruco.js', 'client');
  api.add_files('cv.js', 'client');
  api.add_files('posit1.js', 'client');
  api.add_files('posit2.js', 'client');
  api.add_files('svd.js', 'client');
  api.add_files('export.js');
  
  api.export('aruco');
});

Package.on_test(function (api) {
  api.use('js-aruco');

  api.add_files('js-aruco_tests.js', ['client', 'server']);
});
