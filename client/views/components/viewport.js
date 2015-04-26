Template.viewport.rendered = function () {
    console.log("Starting webGL");

    // Set up the scene, camera, and renderer as global variables.
    var renderer, canvas, camera, scene, backgroundCamera, backgroundScene, mesh;

    var fps = 2;

    //Load image (requires DB integration - pass in imageID as parameter and load?)
    var image = new Image();

    var imageUrl = Images.findOne({_id: Session.get("currentImage")}).url({store: 'master'});
    var position = Images.findOne({_id: Session.get("currentImage")}).metadata;

    console.log("Using " + imageUrl);
    console.log("Found positions at " + position);
    image.src = imageUrl;

    image.addEventListener("load", function () {

        //Set up canvas
        canvas = document.getElementById("viewportCanvas");
        initCanvas(canvas, image);

        //Set up renderer and point it at canvas
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
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
        createBackground(backgroundScene, imageUrl, backgroundCamera);

        // responsive resize
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        Session.set("snapshotted", false);

        animate();
    });

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

            updateModelPosition(mesh);

            scene.add(mesh);
        });
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

        // render
        renderer.clear();
        renderer.render(backgroundScene, backgroundCamera);
        renderer.render(scene, camera);

        if (Session.equals("snapshotted", false)) {
            Session.set("snapshotted", true);
            Session.set("imageData", canvas.toDataURL());
        }


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
    }

};