//https://github.com/CollectionFS/Meteor-CollectionFS/issues/648

Template.viewport.rendered = function () {

    console.log("Starting webGL");

    // Set up the scene, camera, and renderer as global variables.
    var renderer, canvas, camera, scene, backgroundCamera, backgroundScene, mesh;

    var fps = 30;

    var image = new Image();

    var imageUrl = Images.findOne({_id: Session.get("currentImage")}).url({store: 'master'});

    var modelId = Products.findOne({_id: Session.get("currentProduct")}).model._id;
    var modelURL = productModels.findOne({_id: modelId}).url();

    var position = Images.findOne({_id: Session.get("currentImage")}).metadata;

    console.log("Using " + imageUrl);
    console.log("Found positions at " + position);
    image.src = imageUrl;

    image.addEventListener("load", function () {

        //Set up canvas
        canvas = document.getElementById("viewportCanvas");
        initCanvas(canvas, image);

        //Set up renderer and point it at canvas
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, preserveDrawingBuffer: true});
        renderer.setSize(canvas.width, canvas.height);
        renderer.autoClear = false;
        //renderer.setClearColor(0x000044);

        //Set up cameras
        camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 10000);
        camera.position.z = 500;
        backgroundCamera = new THREE.Camera();

        //Set up foreground scene (the JSON model) and background scene (the image)
        scene = new THREE.Scene();
        backgroundScene = new THREE.Scene();

        var light;  // A light shining from the direction of the camera.
        light = new THREE.DirectionalLight();
        light.position.set(0, 0, 1);
        scene.add(light);

        //Add model and background
        createBackground(backgroundScene, imageUrl, backgroundCamera);
        loadModel(scene, modelURL, false);

        // responsive resize
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        animate();
    });

    function loadModel(scene, url, boxed) {
        //Instantiate a loader
        var loader = new THREE.JSONLoader();

        loader.load(url, loadModelCallback, "http://localhost:3000/cfs/files/productTextures/");

        if (boxed) {
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

    };

    function loadModelCallback(geometry, materials) {

        //material = new THREE.MeshBasicMaterial(
        //    {
        //        map: THREE.ImageUtils.loadTexture("/models/dog.jpg"),
        //        depthTest: false,
        //        depthWrite: false
        //    }),
        //material = new THREE.MeshNormalMaterial({
        //    map: THREE.ImageUtils.loadTexture("/models/dog.jpg")
        //}),

        console.log(materials);
        material = new THREE.MeshFaceMaterial(materials),
            mesh = new THREE.Mesh(
                geometry,
                material
            );

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        //mesh = new THREE.Object3D();
        //mesh.add(object);
        updateModelPosition(mesh);
        scene.add(mesh);
    }

    function getMaterial(path) {
        var image = new Image();
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.Texture(image),
            depthTest: false,
            depthWrite: false
        });

        with ({material: material}) {
            image.onload = function () {
                this.loaded = true;
                material.map.image = this;
            };
        }
        image.src = path;
        console.log(image);

        return material;
    }

    function createBackground(scene, url, camera) {
        // Load the background texture
        console.log("Attempting to use " + url + " as texture");
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

        if (Session.get("updatedControls")) {
            if (Session.equals("control", "x")) {
                mesh.scale.x -= 0.1;
                mesh.scale.y -= 0.1;
                mesh.scale.z -= 0.1;
                console.log("X: " + mesh.scale.x + " Y: " + mesh.scale.y + " Z: " + mesh.scale.z)

            } else if (Session.equals("control", "y")) {
                //mesh.position.y += 10;

            } else if (Session.equals("control", "z")) {
                //mesh.position.z += 10;
            } else {
                alert("Goofed");
            }

            Session.set("control", "");
            Session.set("updatedControls", false);
        }

        // render
        renderer.clear();
        renderer.render(backgroundScene, backgroundCamera);
        renderer.render(scene, camera);

        // request new frame
        setTimeout(function () {
            requestAnimationFrame(function () {
                animate();
            });
        }, 1000 / fps);
    }

    function initCanvas(target, img) {
        console.log("Setting canvas size to w: " + img.width + " height: " + img.height);
        target.width = img.width;
        target.height = img.height;

    }

    function updateModelPosition(object) {
        object.rotation.x = position.rotation.x;
        object.rotation.y = position.rotation.y;
        object.rotation.z = position.rotation.z;
        object.position.x = position.position.x;
        object.position.y = position.position.y;
        object.position.z = position.position.z;
        //object.position.z += 200;
    }

};

Template.orienter.events({
    "click .capture": function () {

        //if (window.DeviceMotionEvent != undefined) {
        //
        //    function sample() {
        //        var acceleration;
        //        window.ondevicemotion = function (e) {
        //
        //            acceleration = {
        //                x: event.accelerationIncludingGravity.x,
        //                y: event.accelerationIncludingGravity.y,
        //                z: event.accelerationIncludingGravity.z
        //            }
        //        };
        //        return acceleration;
        //    }
        //
        //    function scan(data) {
        //        if (data.x > 8) {
        //            alert("derp");
        //        }
        //    }
        //
        //    setInterval(alert("hello"), 1000);
        //
        //    document.getElementById("orientationView").innerHTML =
        //        acceleration.x.toString() + " "
        //        + acceleration.y.toString() + " "
        //        + acceleration.z.toString();
        //
        //} else {
        //    alert("No detection capability found");
        //}
    }
});