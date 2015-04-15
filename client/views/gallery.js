//http://stackoverflow.com/questions/19865537/three-js-set-background-image
//http://blog.romanliutikov.com/post/58690562825/external-models-in-three-js
//http://www.html5canvastutorials.com/three/html5-canvas-webgl-rotating-cube/

Template.viewport.rendered = function () {
    console.log("Starting webGL");

    // Set up the scene, camera, and renderer as global variables.
    var renderer, canvas, camera, scene, backgroundCamera, backgroundScene, mesh;

    //Load image (requires DB integration - pass in imageID as parameter and load?)
    var image = new Image();
    image.src = "/images/pic1.jpg";

    //Set up canvas
    canvas = document.getElementById("myCanvas");
    initCanvas(canvas, image);

    //Set up renderer and point it at canvas
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(canvas.width, canvas.height);
    renderer.autoClear = false;

    //Set up cameras
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
    camera.position.z = 500;
    backgroundCamera = new THREE.Camera();

    //Set up foreground scene (the JSON model) and background scene (the image)
    scene = new THREE.Scene();
    backgroundScene = new THREE.Scene();

    //Uncomment for hot cube action
    //var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
    //cube.overdraw = true;
    //scene.add(cube);

    //Add model and background
    loadModel(scene, '/models/car.js');
    createBackground(backgroundScene, '/images/pic1.jpg', backgroundCamera);

    animate();

    function loadModel(scene, url) {
        //Instantiate a loader
        loader = new THREE.JSONLoader();
        loader.load(url, function (geometry) {
            //var material = new THREE.MeshLambertMaterial({
            //    map: THREE.ImageUtils.loadTexture('/models/gtare.jpg')
            //});

            mesh = new THREE.Mesh(
                geometry
                //material
            );

            mesh.receiveShadow = true;
            mesh.castShadow = true;

            mesh.rotation.x = 10;
            mesh.position.x = 10;

            scene.add(mesh);
        });
    }

    function createBackground(scene, url, camera) {
        // Load the background texture
        var texture = THREE.ImageUtils.loadTexture(url);
        var backgroundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 0),
            new THREE.MeshBasicMaterial({
                map: texture
            }));

        backgroundMesh.material.depthTest = false;
        backgroundMesh.material.depthWrite = false;

        // Create your background scene

       scene.add(camera);
        scene.add(backgroundMesh);
    }

    // this function is executed on each animation frame
    function animate() {

        // render
        renderer.clear();
        renderer.render(backgroundScene, backgroundCamera);
        renderer.render(scene, camera);

        // request new frame
        requestAnimationFrame(function () {
            animate();

        });
    }

    function initCanvas(target, img) {
        console.log(img.height);
        console.log(img.width);

        target.width = img.width;
        target.height = img.height;
    }

    function updateModelPosition() {

    }

}
