/**
 * 基于Three.js的三维地图
 */
import React from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import '../../../common/threejslibs/Projector.js';
import '../../../common/threejslibs/CanvasRenderer.js';
import Stats from '../../../common/threejslibs/stats.min.js';

import util from '../../../common/util.jsx';

class Threemap extends React.Component{
	componentDidMount(){
		util.adaptHeight('WebGL-output',105,300);
		this.initThree();
	}
	initThree(){
		let stats;
		let camera, scene, renderer;
		let group;
		let mouseX = 0, mouseY = 0;
		let container = document.getElementById('WebGL-output');
		let width = container.clientWidth,height = container.clientHeight;
		let windowHalfX = width / 2;
		let windowHalfY = height / 2;
		init();
		animate();
		function init() {
			
			camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
			camera.position.z = 500;
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );
			// earth
			let loader = new THREE.TextureLoader();
			let planetTexture = require("./assets/imgs/planets/Earth.png");

			loader.load( planetTexture, function ( texture ) {
				let geometry = new THREE.SphereGeometry( 200, 20, 20 );
				let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
				let mesh = new THREE.Mesh( geometry, material );
				group.add( mesh );
			} );
			// shadow
			let canvas = document.createElement( 'canvas' );
			canvas.width = 128;
			canvas.height = 128;
			let context = canvas.getContext( '2d' );
			let gradient = context.createRadialGradient(
				canvas.width / 2,
				canvas.height / 2,
				0,
				canvas.width / 2,
				canvas.height / 2,
				canvas.width / 2
			);
			gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
			gradient.addColorStop( 1, 'rgba(255,255,255,1)' );
			context.fillStyle = gradient;
			context.fillRect( 0, 0, canvas.width, canvas.height );
			let texture = new THREE.CanvasTexture( canvas );
			let geometry = new THREE.PlaneBufferGeometry( 300, 300, 3, 3 );
			let material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
			let mesh = new THREE.Mesh( geometry, material );
			mesh.position.y = - 250;
			mesh.rotation.x = - Math.PI / 2;
			group.add( mesh );
			renderer = new THREE.CanvasRenderer();
			renderer.setClearColor( 0xffffff );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			container.appendChild( renderer.domElement );
			// stats = new Stats();
			container.appendChild( stats.dom );
			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			//
			window.addEventListener( 'resize', onWindowResize, false );
		}
		function onWindowResize() {
			windowHalfX = width / 2;
			windowHalfY = height / 2;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize( width, height );
		}
		function onDocumentMouseMove( event ) {
			mouseX = ( event.clientX - windowHalfX );
			mouseY = ( event.clientY - windowHalfY );
		}
		//
		function animate() {
			requestAnimationFrame( animate );
			render();
			stats.update();
		}
		function render() {
			camera.position.x += ( mouseX - camera.position.x ) * 0.05;
			camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
			camera.lookAt( scene.position );
			group.rotation.y -= 0.005;
			renderer.render( scene, camera );
		}
	}
	render(){
		return(
			<div id='WebGL-output'></div>
		)
	}
}

export default Threemap;