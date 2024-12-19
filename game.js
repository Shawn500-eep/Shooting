// Game Setup

let scene, camera, renderer;
let player, playerSpeed = 0.1, mouseX = 0, mouseY = 0;
let raycaster, isShooting = false;

const bulletSpeed = 0.5;
const bullets = [];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Player
    player = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2, 1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(player);
    player.position.set(0, 1, 0);

    // Raycaster for shooting
    raycaster = new THREE.Raycaster();

    // Lighting
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide })
    );
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // Event Listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mouseup', onMouseUp);

    // Window resizing
    window.addEventListener('resize', onWindowResize);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Update mouse position for player camera control
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onKeyDown(event) {
    switch (event.key) {
        case 'w': // Move forward
            player.position.z -= playerSpeed;
            break;
        case 's': // Move backward
            player.position.z += playerSpeed;
            break;
        case 'a': // Move left
            player.position.x -= playerSpeed;
            break;
        case 'd': // Move right
            player.position.x += playerSpeed;
            break;
    }
}

function onMouseUp(event) {
    if (event.button === 0) { // Left mouse button
        shoot();
    }
}

function shoot() {
    // Create a bullet and shoot it from the camera's position
    const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    bullet.position.set(player.position.x, player.position.y, player.position.z);
    scene.add(bullet);

    const direction = new THREE.Vector3(0, 0, -1).applyMatrix4(camera.matrixWorld);
    bullet.velocity = direction.multiplyScalar(bulletSpeed);
    bullets.push(bullet);
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.position.add(bullet.velocity);
        // Remove bullets that go out of view
        if (bullet.position.z < -1000) {
            scene.remove(bullet);
            bullets.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update camera position
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 1; // Keep the camera above the player
    camera.position.z = player.position.z + 2;

    // Rotate the camera based on mouse movement
    camera.rotation.x = mouseY * 0.5;
    camera.rotation.y = mouseX * 0.5;

    // Update bullets
    updateBullets();

    // Render the scene
    renderer.render(scene, camera);
}

init();
