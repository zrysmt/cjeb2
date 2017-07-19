/**
 * 基于Three.js的三维地图based on Three.js
 */
import React from 'react';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
// import '../../../common/threejslibs/OrbitControls.js';
import '../../../common/threejslibs/Projector.js';
// import '../../../common/threejslibs/CanvasRenderer.js';   //CanvasRenderer
import Stats from '../../../common/threejslibs/stats.min.js';

import util from '../../../common/util.jsx';
import threeUtil from './util.js';

class Threemap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [30, 110],
            zoom: 5
        }
    }
    componentWillReceiveProps(props) {
        this.setState({ center: props.center, zoom: props.zoom }, () => {

        })
    }
    componentDidMount() {
        util.adaptHeight('WebGL-output', 105, 300);
        let { center, zoom } = this.state;

        this.initThree(center, zoom);
    }
    initThree(center, zoom) {
        let stats;
        let camera, scene, renderer;
        let radius = 200; //地球半径
        let group;
        let container = document.getElementById('WebGL-output');
        let width = container.clientWidth,
            height = container.clientHeight;

        clear();
        init();
        animate();

        function init() {
            scene = new THREE.Scene();
            group = new THREE.Group();
            scene.add(group);

            camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 500;
            camera.lookAt(scene.position);

            //控制地球
            let orbitControls = new /*THREE.OrbitControls*/ Orbitcontrols(camera);
            // orbitControls.autoRotate = true;
            let clock = new THREE.Clock();
            //光源
            let ambi = new THREE.AmbientLight(0x686868);
            scene.add(ambi);

            let spotLight = new THREE.DirectionalLight(0xffffff);
            spotLight.position.set(550, 100, 550);
            spotLight.intensity = 0.6;

            scene.add(spotLight);
            // Texture
            let loader = new THREE.TextureLoader();
            let planetTexture = require("./assets/imgs/planets/Earth.png");

            loader.load(planetTexture, function(texture) {
                let geometry = new THREE.SphereGeometry(radius, 30, 30);
                let material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
                let mesh = new THREE.Mesh(geometry, material);
                // let coord = threeUtil.lngLat2Coordinate(center[0],center[1],radius);  //坐标转化
                /*let coord = threeUtil.getPosition(center[0],center[1],0);  //坐标转化
                console.log(coord,center);
                mesh.position.x = coord.x;
                mesh.position.y = coord.y;
                mesh.position.z = coord.z;*/
                group.add(mesh);
            });

            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xffffff);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            stats = new Stats();
            // container.appendChild( stats.dom );  //增加状态信息 
            addMarker(40.7, -73.6, 0x0000FF);
            var GCNY = convertLatLonToVec3(40.7, -73.6).multiplyScalar(100.5);
            addMarker(30, -90, 0x00FF00);
            var NOLA = convertLatLonToVec3(30, -90).multiplyScalar(100.5);
            drawCurve(createSphereArc(GCNY, NOLA), 0x00FFFF);
        }

        function addMarker(lat, lon, colory) {
            var marker = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial({ color: colory }));
            let coord = convertLatLonToVec3(lat, lon).multiplyScalar(radius);
            marker.position.x = coord.x;
            marker.position.y = coord.y;
            marker.position.z = coord.z;
            scene.add(marker);
        }

        function convertLatLonToVec3(lat, lon) {
            lat = lat * Math.PI / 180.0;
            lon = -lon * Math.PI / 180.0;
            return new THREE.Vector3(
                Math.cos(lat) * Math.cos(lon),
                Math.sin(lat),
                Math.cos(lat) * Math.sin(lon));
        }

        function greatCircleFunction(P, Q) {
            var angle = P.angleTo(Q);
            return function(t) {
                var X = new THREE.Vector3().addVectors(
                        P.clone().multiplyScalar(Math.sin((1 - t) * angle)),
                        Q.clone().multiplyScalar(Math.sin(t * angle)))
                    .divideScalar(Math.sin(angle));
                return X;
            };
        }

        function createSphereArc(P, Q) {
            var sphereArc = new THREE.Curve();
            sphereArc.getPoint = greatCircleFunction(P, Q);
            return sphereArc;
        }

        function drawCurve(curve, color) {
            var lineGeometry = new THREE.Geometry();
            lineGeometry.vertices = curve.getPoints(100);
            lineGeometry.computeLineDistances();
            var lineMaterial = new THREE.LineBasicMaterial();
            lineMaterial.color = (typeof(color) === "undefined") ? new THREE.Color(0xFF0000) : new THREE.Color(color);
            var line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
        }

        function clear() {
            container.innerHTML = '';
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
            // stats.update();
        }

        function render() {
            // group.rotation.y -= 0.005;  //这行可以控制地球自转
            renderer.render(scene, camera);
        }
    }
    render() {
        return ( <div id = 'WebGL-output' > </div>)
    }
}

export default Threemap;