/*
    Author(a): Kelly Daniella Marin Montealegre
    Date of creation: 22 de Marzo 2023
    Last modification: 22 de Marzo 2023 14:20
*/

var scene = null,      // Is the place where webgl draw all elements in the screen 
    camera = null,     // Is the element to allow see
    myCanvas = null,   // Is the Canvas ("lienzo")
    renderer = null,   // Is the process to represent the content
    controls = null,   // Is the controller that user have to move the mouse in the screen (Zoom in, z. Out, movement, drag)
    namesModelObjMtl = ["peon_ficha",    //0
                        "alfil_ficha",   //1
                        "caballo_ficha", //2
                        "torre_ficha",   //3
                        "reina_ficha",   //4
                        "rey_ficha"];    //5

function initScene() {
    makeScene();
    // createGrid(10, 10);
    renderScreen();
    createtablechess();
    // createcards();
    createFichas('negras');
    createFichas('blancas');
    window.addEventListener('resize', onWindowResize, false); // resize 
    createLight('pointLight');
}

function createFichas(expression) {
    switch (expression) {
        case 'negras':
            createModel("../models/OBJMTL/fichas_ajedrez/",-0.5);
          break;
        case 'blancas':
            createModel("../models/OBJMTL/fichas_ajedrez/",43);
          break;
    }
}

function createModel(namefolder,factor) {
    // PEONES (X8)
    for (let index = 0; index < 8; index++) {
        loadModel_ObjMtl(namefolder,namesModelObjMtl[0]+".mtl",namesModelObjMtl[0]+".obj",(index*6.3),0.73*factor);
    }
    // ALFIL (X2)
    for (let index =0; index < 2; index++){
        loadModel_ObjMtl(namefolder,namesModelObjMtl[1]+".mtl",namesModelObjMtl[1]+".obj",((index*19)-2),1*factor);
    }
    // CABALLOS (X2)
    for (let index = 0; index < 2; index++) {
        loadModel_ObjMtl(namefolder,namesModelObjMtl[2]+".mtl",namesModelObjMtl[2]+".obj",((index*30)+7),1*factor);
    }
    // TORRES (X2)
    for (let index =0; index < 2; index++){
        loadModel_ObjMtl(namefolder,namesModelObjMtl[3]+".mtl",namesModelObjMtl[3]+".obj",((index*43)+6),1*factor);
    }
    //REINA (x1)
    loadModel_ObjMtl(namefolder,namesModelObjMtl[4]+".mtl",namesModelObjMtl[4]+".obj",4,1*factor);

    //REY (X1)
    loadModel_ObjMtl(namefolder,namesModelObjMtl[5]+".mtl",namesModelObjMtl[5]+".obj",15,1*factor);
}
function makeScene() {
    // 1ER. Create a Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFF8F1);
    // 2DO. Create a 3D camera
    camera = new THREE.PerspectiveCamera(75,  // FOV (Campo de vision)
        window.innerWidth / window.innerHeight, // aspect (tamaño de la pantalla)
        0.1, // Near (Cercano)
        1000); // Far (Lejano)

    scene.add(camera);
    // 3RO. To Render (Representar/visualizar algo)
    myCanvas = document.querySelector('.webgl');
    renderer = new THREE.WebGLRenderer({ canvas: myCanvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // To Make Controls on Screen
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.x = -25;
    camera.position.y = 25;
    camera.position.z = 49;

    controls.update();

}


//tablero

function createtablechess() {

    var loader = new THREE.TextureLoader();

    var texture = loader.load('../img/uv_test_bw_1024.png', function (texture) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(4, 4);

    });

    var material = new THREE.MeshBasicMaterial({

        color: 0xffffff,
        specular: 0x111111,
        shininess: 10,
        map: texture,
        side: THREE.DoubleSide

    });

    // Plane
    const planeGeomery = new THREE.PlaneGeometry(50, 50);
    const plane = new THREE.Mesh(planeGeomery, material);
    scene.add(plane);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 2;
    plane.position.x = 7.5;
    plane.position.z = 19;
}
function createcards() {

    const geometry = new THREE.PlaneGeometry(3, 6);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load('../img/caballo.png')
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.position.x = 8;
    //plane.position.y=3;
    plane.rotation.x = Math.PI / 2;

    const geometry2 = new THREE.PlaneGeometry(3, 6);
    const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const plane2 = new THREE.Mesh(geometry2, material2);
    scene.add(plane2);
    plane2.position.x = -8;
    //plane2.position.y=3;
    plane2.rotation.x = Math.PI / 2;

}

function loadModel_ObjMtl(folderObjMtl, filemtl, fileobj, i, j) {
    var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setResourcePath(folderObjMtl);  //"../models/OBJMTL/fichas_ajedrez/"
        mtlLoader.setPath(folderObjMtl); // "../models/OBJMTL/fichas_ajedrez/"
        mtlLoader.load(filemtl, function (materials) { //"peonB_ficha.mtl"

        materials.preload();
    });
    var objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath(folderObjMtl); //"../models/OBJMTL/fichas_ajedrez/"
    objLoader.load(fileobj, function (object) { //"peonB_ficha.obj"

        scene.add(object);
        //object.scale.set(3, 3, 3);

        if(j==-1){
            object.position.set(i,0,j+33);
            //object.rotation.y = Math.PI*-0.2;
        }else{
            object.position.set(i,0,j);
        }
    });
}

function createLight(typeLight) {

    switch (typeLight) {
        case 'AmbientLight':   
            // Ambient Light
            const light = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
            scene.add(light);
            break;
        case 'directionalLight':
            // Direction Light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            scene.add(directionalLight);

            const helper = new THREE.DirectionalLightHelper(directionalLight);
            scene.add(helper);
            break;
        case 'pointLight':
            const pointLight = new THREE.PointLight(0xfffff0, 1, 500);
            pointLight.position.set(1, 10, 20);
            scene.add(pointLight);

            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
            scene.add(pointLightHelper);
            break;
        case 'SpotLight':
            // white spotlight shining from the side, modulated by a texture, casting a shadow
            const spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(0, 10, 0);
            spotLight.map = new THREE.TextureLoader().load('../img/face2.png');

            spotLight.castShadow = true;

            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;

            spotLight.shadow.camera.near = 500;
            spotLight.shadow.camera.far = 4000;
            spotLight.shadow.camera.fov = 30;

            scene.add(spotLight);

            break;

    }
}
function createGrid(data1_size, data2_division) {
    const size = data1_size;
    const divisions = data2_division;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
}
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
function renderScreen() {
    requestAnimationFrame(renderScreen);
    controls.update();
    renderer.render(scene, camera);
}
