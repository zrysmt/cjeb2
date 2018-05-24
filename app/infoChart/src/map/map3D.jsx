/*
 *  height = {height}
 *  center = {center}    
    viewerOption = {{
        sceneMode : Cesium.SceneMode.SCENE3D,  //MORPHING  SCENE2D COLUMBUS_VIEW  SCENE3D 
        // imageryProvider:'OpenStreetMap',
    }}        
 *
 */

import './map3D.scss';
import 'cesium/Widgets/widgets.css';

import React,{Component} from 'react';
import Cesium from 'cesium/Cesium';
import _ from 'lodash';
import Eventful from '../common/eventful.js';

import gVar from './global';

class Map3D extends Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:4,
            data:[]
        };
        this.index = 0;
    }	
    componentDidMount(){
    	// util.adaptHeight('cesiumContainer',105,300);//高度自适应
    	Cesium.BingMapsApi.defaultKey = 'AgiU9gCjKNfaR2yFSDfLw8e9zUlAYisRvRC2_L-LsGYN2bII5ZUvorfP3QJvxmjn';
		let {show,center,height,viewerOption} = this.props;
		if(!show) return;
		height = height ? height : 10000000;
		let option = {
    		// sceneMode : Cesium.SceneMode.SCENE3D,
    		animation:false,
    		baseLayerPicker:true,
    		fullscreenButton:false,
    		geocoder:false,
    		homeButton:false,
    		infoBox:false,
    		timeline:false,
    		navigationHelpButton:false,
    		navigationInstructionsInitiallyVisible:false
    	};
    
    	if(viewerOption) option = _.defaultsDeep({},option,viewerOption);
		if(viewerOption && viewerOption.imageryProvider){
			if(viewerOption.imageryProvider == 'OpenStreetMap'){
	    		option.imageryProvider = new Cesium.createOpenStreetMapImageryProvider({
	    			url : '//a.tile.openstreetmap.org/'
	    		})
	    	}     		
	    	option.baseLayerPicker = false;
    	}    	
    	if(__DEV__) console.log('viewer option',option);

    	let viewer = new Cesium.Viewer('cesiumContainer',option);
    	this.viewer = gVar.viewer = viewer;


    	viewer.camera.flyTo({
        	destination: Cesium.Cartesian3.fromDegrees(center[1], center[0],height),
    	});  
    	this.mapEvent();
    }
    mapEvent(){
    	let viewer = this.viewer;
    	let oldPos = viewer.scene.camera.position;
    	let oldCg = this.cartesian2Cartographic(oldPos.x,oldPos.y,oldPos.z);
		let	oldZoom = Math.round(oldCg.alt/1000000);

    	viewer.scene.camera.moveEnd.addEventListener(()=>{
    		//笛卡尔空间直角坐标系转为经纬度坐标
    		let pos = viewer.scene.camera.position;
    		let cg = this.cartesian2Cartographic(pos.x,pos.y,pos.z);
			let zoom = Math.round(cg.alt/1000000);
			this.index ++;
			if(this.index > 1){
				Eventful.dispatch('threeCenter',[cg.lat,cg.lng]);
				if(oldZoom - zoom > 0){ // zoom ++
					Eventful.dispatch('threeZoom',Math.abs(oldZoom - zoom));
					if(__DEV__) console.log('zoom+',Math.abs(oldZoom - zoom));
				}else if(oldZoom - zoom < 0){
					Eventful.dispatch('threeZoom',-Math.abs(oldZoom - zoom));
					if(__DEV__) console.log('zoom-',Math.abs(oldZoom - zoom));
				}
				oldZoom = zoom;				
			}

		});
    }
    cartesian2Cartographic(x,y,z){
		let cartesian3 = new Cesium.Cartesian3(x,y,z);
		let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);

		let lat = Cesium.Math.toDegrees(cartographic.latitude);
		let lng = Cesium.Math.toDegrees(cartographic.longitude);
		let alt = cartographic.height;   
		// console.log(lat,lng,alt);
		return {
			lat:lat,
			lng:lng,
			alt:alt
		} 	
    }
    componentWillUnmount(){
        if(this.viewer){
             this.viewer = null;
             gVar.viewer = null;
        }
    }    
    render(){
    	return(
    		<div id="cesiumContainer"></div>
    	)
    }
}


export default Map3D;