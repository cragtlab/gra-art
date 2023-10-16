/*

  #container {
            position: relative;
            
            transition: opacity 2s;
        }

        #container canvas,
        #overlay {
            background: beige;
            position: absolute;
            align-items: center;
            justify-content: center;
        }
 
         <div id="container">
        <canvas id="loadingCanvas"></canvas>
        <div id="overlay">   
            <h2>Scan To Join The MetaVerse (Limited to 30 pax)</h2>
            <img width="320" height="320" align="left" />
            <h2>Explorer or Web3 Wallet User?</h2>
            <button onclick="var name=prompt('Enter Name');if(name){loaded=true;}" style="width: 30%">Explore</button>
            <br/><b>OR</b>
            <br/><button onclick="loaded=true" style="width: 30%">Web3 Wallet User</button>
        </div>
    </div>



<script src="loading.js"></script>
	
    till 5,6
...
 requestAnimationFrame(animate);
            if (!loaded) {
                return;
            }
*/
let loaded = false, chooseCharacter = false;
xxx(); function xxx() {
    document.getElementById("overlay").style.background = 'black';
    document.getElementById("container").style.color = 'white';

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    scene.add(camera);
    camera.position.set(0, 35, 70);

    //var renderer = new THREE.WebGLRenderer({ antialias: true });
    var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("loadingCanvas") });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Orbit Controls
    //var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    //Lights
    var ambientLight = new THREE.AmbientLight(0xf1f1f1);
    scene.add(ambientLight);

    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(50, 50, 50);
    scene.add(spotLight);

    //Objects (We build a mesh using a geometry and a material)

    //Earth
    var earthGeometry = new THREE.SphereGeometry(10, 50, 50);
    var earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.ImageUtils.loadTexture("/public/assets/earth_texture_2.jpg"),
        color: 0xf2f2f2,
        specular: 0xbbbbbb,
        shininess: 2
    });
    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    //Clouds
    var cloudGeometry = new THREE.SphereGeometry(10.3, 50, 50);
    var cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.ImageUtils.loadTexture("/public/assets/clouds_2.jpg"),
        transparent: true,
        opacity: 0.1
    });
    var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    //Stars
    var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
    var starMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.ImageUtils.loadTexture("/public/assets/galaxy_starfield.png"),
        side: THREE.DoubleSide,
        shininess: 0
    });
    var starField = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starField);

    //Moon 
    var moonGeometry = new THREE.SphereGeometry(3.5, 50, 50);
    var moonMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture("/public/assets/moon_texture.jpg")
    });
    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(35, 0, 0);
    scene.add(moon);

    //Camera vector
    var earthVec = new THREE.Vector3(0, 0, 0);

    var r = 35;
    var theta = 0;
    var dTheta = 2 * Math.PI / 1000;

    var dx = .01;
    var dy = -.01;
    var dz = -.05;



    //Render loop
    var render = function () {
        if(accounts && accounts[0]){
            loaded=true;
            alert("yeah");
        }
        if (loaded) {
            container.style.opacity = 0;
            return;
        }
        earth.rotation.y += .0009;
        clouds.rotation.y += .00005;

        //Moon orbit        
        theta += dTheta;
        moon.position.x = r * Math.cos(theta);
        moon.position.z = r * Math.sin(theta);

        //Flyby
        if (camera.position.z < 0) {
            dx *= -1;
        }
        camera.position.x += dx;
        camera.position.y += dy;
        camera.position.z += dz;

        camera.lookAt(earthVec);

        //Flyby reset
        if (camera.position.z < -100) {
            camera.position.set(0, 35, 70);
        }

        camera.lookAt(earthVec);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };
    render();

}