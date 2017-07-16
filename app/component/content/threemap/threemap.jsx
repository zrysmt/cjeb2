/**
 * 基于Three.js的三维地图
 */
import React from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';

import util from '../../../common/util.jsx';

class Threemap extends React.Component{
	componentDidMount(){
		util.adaptHeight('WebGL-output',105,300);
		this.initThree();
	}
	initThree(){
		let scene =  new THREE.Scene();

		let webGLContainer = document.querySelector('#WebGL-output');
		let width = webGLContainer.clientWidth,height = webGLContainer.clientHeight;
		let camera = new THREE.PerspectiveCamera(45,  width/height , 0.1, 1000);

		// create a render and set the size
        let webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0x000, 1.0));
        webGLRenderer.setSize(width, height);
        webGLRenderer.shadowMap.enabled;

        let sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));
        // add the sphere to the scene
        scene.add(sphere);

        // position and point the camera to the center of the scene
        camera.position.x = -10;
        camera.position.y = 15;
        camera.position.z = 25;

        camera.lookAt(new THREE.Vector3(0, 0, 0));

        var orbitControls = new /*THREE.OrbitControls*/Orbitcontrols(camera);
        orbitControls.autoRotate = false;
        var clock = new THREE.Clock();
        //环境光
        var ambi = new THREE.AmbientLight(0x000000);
        scene.add(ambi);
        //点光源
        var spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(550, 100, 550);
        spotLight.intensity = 0.6;

        scene.add(spotLight);

        // add the output of the renderer to the html element
        document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

        webGLRenderer.render(scene,camera);

        function createMesh(geom) {
            let planetTexture = THREE.TextureLoader(require("./assets/imgs/planets/Earth.png"));
            let specularTexture = THREE.TextureLoader(require("./assets/imgs/planets/EarthSpec.png"));
            let normalTexture = THREE.TextureLoader(require("./assets/imgs/planets/EarthNormal.png"));


            let planetMaterial = new THREE.MeshPhongMaterial();
            planetMaterial.specularMap = specularTexture;
            planetMaterial.specular = new THREE.Color(0x4444aa);


            planetMaterial.normalMap = normalTexture;
            planetMaterial.map = planetTexture;
			//  planetMaterial.shininess = 150;


            // create a multimaterial
            let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

            return mesh;
        }

	}
	render(){
		return(
			<div id='WebGL-output'></div>
		)
	}
}

export default Threemap;