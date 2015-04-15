Template.viewport.rendered = function () {
    console.log("Starting render");
    // Set up the scene, camera, and renderer as global variables.
    // revolutions per second
    var angularSpeed = 0.2;
    var lastTime = 0;

    var containerWidth = Math.floor($(".modal-body").width());
    var containerHeight = Math.floor($(".modal-body").height());


    // this function is executed on each animation frame
    function animate() {
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
        cube.rotation.y += angleChange;
        lastTime = time;

        // render
        renderer.render(scene, camera);

        // request new frame
        requestAnimationFrame(function () {
            animate();
        });
    }

    function resize(gl) {
        var canvas = gl.canvas;

        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth ||
            canvas.height != displayHeight) {

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;

            // Set the viewport to match
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    // renderer
    var canvas = document.getElementById("myCanvas");
    var renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(containerWidth, containerHeight);

    var gl = getWebGLContext(canvas, undefined, {dontResize: true, noTitle: true});

    // camera
    var camera = new THREE.PerspectiveCamera(45, containerHeight / containerWidth, 1, 1000);
    camera.position.z = 500;

    // scene
    var scene = new THREE.Scene();

    // cube
    var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshNormalMaterial());
    cube.overdraw = true;
    scene.add(cube);

    // start animation
    animate();

}
