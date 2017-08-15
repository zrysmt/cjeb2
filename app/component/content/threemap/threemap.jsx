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

import Eventful from '../../../common/eventful.js';
import util from '../../../common/util.jsx';
import threeUtil from './util.js';

let radius = 250; //地球半径
let stats,container;
let camera, scene, renderer,orbitControls,group;


class Threemap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [30, 110],
            zoom: 4,
            data: []
        }
    }
    componentWillReceiveProps(props) {
        this.setState({ center: props.center, zoom: props.zoom,data:props.data }, () => {
            this.initChart(this.state.data);
        })
    }
    componentDidMount() {
        util.adaptHeight('WebGL-output', 105, 300);
        let { center, zoom } = this.state;

        this.initThree(center, zoom);
    }
    initChart(data){
        data.sort(function (a,b) {
            return (+a.value) - (+b.value);
        });

        let boxMeshArr = [];
        //clear
        console.log('---',scene.getObjectByName('boxMesh', true));

        let parent = new THREE.Object3D();
        parent.name = "boxMesh";
        data.forEach((d,i)=>{
            let value = !(+d.value)?0:(+d.value)/data[data.length-1].value *160;
            let boxMesh = this.addBoxGeomtry(d.lat, d.lng,value,radius,'#44a3e5');
            parent.add(boxMesh);
            group.add(parent);
        });
    }
    initThree(center, zoom) {
        container = document.getElementById('WebGL-output');
        let width = container.clientWidth,
            height = container.clientHeight;

        let self = this;
        clear();
        init();
        animate();
        this.handleEventListener();
        function init() {
            scene = new THREE.Scene();
            group = new THREE.Group();
            scene.add(group);

            camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
            let cPosition = self.cameraPositionByZoomCenter(camera,zoom,center);
            camera.position.x = cPosition.x;
            camera.position.y = cPosition.y;
            camera.position.z = cPosition.z;
            camera.lookAt(new THREE.Vector3(0,0,0));

            //控制地球
            orbitControls = new /*THREE.OrbitControls*/ Orbitcontrols(camera,container);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.8;  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            // orbitControls.autoRotate = true;  //是否自动旋转
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
            let geometry = new THREE.SphereGeometry(radius, 30, 30);
            let material = new THREE.MeshBasicMaterial({  overdraw: 0.5 });

            let planetMaterial = new THREE.MeshPhongMaterial( {
                specular: 0x444444,
                map: loader.load(require("./assets/imgs/planets/Earth.png")),
                // map: loader.load(require("./assets/imgs/planets/land_ocean.jpg")),
                specularMap:loader.load(require("./assets/imgs/planets/EarthSpec.png")),
                normalMap: loader.load(require("./assets/imgs/planets/EarthNormal.png"))
            });

            let mesh = new THREE.Mesh( geometry, planetMaterial );
            group.add(mesh);

            renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xffffff);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);
            stats = new Stats();
            // container.appendChild( stats.dom );  //增加状态信息
        }


        function clear() {
            container.innerHTML = '';
        }

        function animate() {
            orbitControls.update();
            requestAnimationFrame(animate);
            render();
            // stats.update();
        }

        function render() {
            // group.rotation.y -= 0.005;  //这行可以控制地球自转
            group.rotation.x = 0.5; //定位到中国
            group.rotation.y = 3;
            renderer.render(scene, camera);
        }
    }
    removeAllGeomotry(){
        for( let i = scene.children.length - 1; i >= 0; i--) {
            let obj = scene.children[i];
            scene.remove(obj);
        }
    }
    removeObjByName(objName){
        let selectedObject = scene.getObjectByName(objName);
        scene.remove( selectedObject );
    }
    cameraPositionByZoomCenter(camera,zoom,center){
        //以center[30 110],zoom 4 为标准
        let x,y,z;
        let CENTER = this.state.center;
        let ZOOM = this.state.zoom;
        if(center)  x = (center[1]-CENTER[1])*10+30;
        if(center)  y = (center[0]-CENTER[0])*10+30;
        if(zoom)    z = 400 - (zoom - ZOOM)*50;
        console.log(CENTER,x,y,z);
        return{
            x:x,
            y:y,
            z:z
        }
    }
    handleEventListener(){
        Eventful.subscribe('twoZoom',(zoom)=>{
            console.log('l zoom',zoom);
            let cPosition = this.cameraPositionByZoomCenter(camera,zoom,'');
            camera.position.z = cPosition.z;
        });
        Eventful.subscribe('twoMove',(center)=>{
            console.log('l move',center);
            let cPosition = this.cameraPositionByZoomCenter(camera,'',[center.lat,center.lng]);
            camera.position.x = cPosition.x;
            camera.position.y = cPosition.y;
        });
        let x1=0,x2=0,y1=0,y2=0;
        container.addEventListener('mousedown',(e)=>{
            x1 = e.clientX;
            y1 = e.clientY;
        });
        container.addEventListener('mouseup',(e)=>{
            let deltaX = e.clientX - x1;
            let deltaY = e.clientY - y1;
            let CENTER = this.state.center;
            if(__DEV__) console.log('[deltaX,deltaY]:',[deltaX,deltaY]);
            let newCenter = [deltaY*0.5+CENTER[0],-deltaX*0.5+CENTER[1]];
            if(__DEV__) console.log('newCenter',newCenter);
            Eventful.dispatch('threeCenter',newCenter)  //坐标关系

        });

        container.addEventListener('wheel',(e)=>{
            console.log('wheel',e);
            if(e.deltaY > 0){  //zoom--
                Eventful.dispatch('threeZoom',-1);
            }else if(e.deltaY < 0){  //zoom++
                Eventful.dispatch('threeZoom',1);
            }
        })
    }
    /**
     * 绘制线
     */
    drawCurve(lat1,lon1,lat2,lon2,radius, color) {
        let point1 = this.convertLatLonToCood(lat1, lon1,radius);
        let point2 = this.convertLatLonToCood(lat2, lon2,radius);
        let curve = createSphereArc(point1, point2);
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices = curve.getPoints(100);
        lineGeometry.computeLineDistances();
        let lineMaterial = new THREE.LineBasicMaterial();
        lineMaterial.color = (typeof(color) === "undefined") ? new THREE.Color(color) : new THREE.Color(color);
        let line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
        function greatCircleFunction(P, Q) {
            let angle = P.angleTo(Q);
            return function(t) {
                let X = new THREE.Vector3().addVectors(
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
    }
    /**
     * 绘制圆柱
     */
    addBoxGeomtry(lat, lon, zValue,radius,colory) {
        let boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, zValue), new THREE.MeshBasicMaterial({ color: colory }));
        let coord = this.convertLatLonToCood(lat, lon,radius);
        boxMesh.position.x = coord.x;
        boxMesh.position.y = coord.y;
        boxMesh.position.z = coord.z;
        boxMesh.rotation.x = 0.8;
        // boxMesh.rotation.y = 1;
        return boxMesh;
    }
    /**
     * 绘制点
     */
    addMarker(lat, lon, radius,colory) {
        var marker = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), new THREE.MeshBasicMaterial({ color: colory }));
        let coord = this.convertLatLonToCood(lat, lon,radius);
        marker.position.x = coord.x;
        marker.position.y = coord.y;
        marker.position.z = coord.z;
        group.add(marker);
    }
    convertLatLonToCood(lat, lon,radius){
        return this.convertLatLonToVec3(lat, lon).multiplyScalar(radius);
    }
    convertLatLonToVec3(lat, lon){
        lat = lat * Math.PI / 180.0;
        lon = -lon * Math.PI / 180.0;
        return new THREE.Vector3(
            Math.cos(lat) * Math.cos(lon),
            Math.sin(lat),
            Math.cos(lat) * Math.sin(lon));
    }
    render() {
        return ( <div id = 'WebGL-output' > </div>)
    }
}

export default Threemap;