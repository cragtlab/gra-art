var earthGeometry = new THREE.SphereGeometry(10, 50, 50);
var earthMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("/public/assets/earth_texture_2.jpg"),
    color: 0xf2f2f2,
    specular: 0xbbbbbb,
    shininess: 2
});
var earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(-17, 2, 1.8);
earth.scale.set(0.5, 0.5, 0.5)
scene.add(earth);

var moonGeometry = new THREE.SphereGeometry(3.5, 50, 50);
var moonMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture("/public/assets/moon_texture.jpg")
});
var moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(-11,2,8)
moon.scale.set(0.5, 0.5, 0.5)
scene.add(moon);

var theta = 0;
var dTheta = 2 * Math.PI / 1000;
var r = 35;
/*
var cloudGeometry = new THREE.SphereGeometry(10.3, 50, 50);
var cloudMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture("/public/assets/clouds_2.jpg"),
    transparent: true,
    opacity: 0.1
});
var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(clouds);

var starGeometry = new THREE.SphereGeometry(1000, 50, 50);
      var starMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.ImageUtils.loadTexture("/public/assets/galaxy_starfield.png"),
        side: THREE.DoubleSide,
        shininess: 0
      });
      var starField = new THREE.Mesh(starGeometry, starMaterial);
      scene.add(starField);
*/
