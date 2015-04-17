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

    //Add model and background
    loadModel(scene, '/models/car.js', true);
    createBackground(backgroundScene, '/images/pic1.jpg', backgroundCamera);

    //updateModelPosition(mesh);

    animate();

    function loadModel(scene, url, boxed) {
        //Instantiate a loader
        loader = new THREE.JSONLoader();
        loader.load(url, function (geometry, material) {
            material = new THREE.MeshBasicMaterial(
                {
                    map: THREE.ImageUtils.loadTexture("/models/gtare.jpg"),
                    depthTest: false,
                    depthWrite: false
                }),

            mesh = new THREE.Mesh(
                geometry,
                material
            );

            mesh.receiveShadow = true;
            mesh.castShadow = true;

            if (boxed){
                //hot cube action
                console.log("Adding guide box");
                var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshBasicMaterial({
                        wireframe: true,
                        color: 'blue'
                    })
                );
                cube.overdraw = true;
                scene.add(cube);
                updateModelPosition(cube);

            }

            updateModelPosition(mesh);

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

    function updateModelPosition(object) {
        object.rotation.x = -0.186;
        object.rotation.y = -0.672;
        object.rotation.z = -3.01;
        object.rotation.x = 4.27;
        object.rotation.y = -4.91;
        object.rotation.z = -263.32;
    }

};

Template.photoTile.events({
    'click': function () {
        var currentImage = this._id;
        bootbox.dialog({
            title: 'View image',
            message: renderTemplate(Template.viewport),
            buttons: {
                close: {
                    label: "Close",
                    className: "btn btn-primary",
                    callback: function () {
                        //take some actions
                    }
                },

                visualise: {
                    label: "Visualise",
                    className: "btn btn-primary",
                    callback: function () {
                        Session.set("currentImage", Images.findOne({_id: currentImage})._id);
                    }
                },

                delete: {
                    label: "Delete",
                    className: "btn btn-danger",
                    callback: function () {
                        console.log(this._id);
                        Images.remove(this._id);
                    }
                }
            }
        });
        Blaze.render(Template.detector, $("#detectorNode")[0]);
    }
});

Template.images.helpers({
    images: function () {
        return Images.find();
    }

});
