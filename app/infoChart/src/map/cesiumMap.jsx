import './cesiumMap.scss';
import 'cesium/Widgets/widgets.css';

import React,{Component} from 'react';
import Cesium from 'cesium/Cesium';

import util from './common/util.jsx';
import Eventful from './common/eventful.js';

import gVar from './global';

class CesiumMap extends Component{
	constructor(props){
        super(props);
        this.state = {
            center:[30,104],
            zoom:4,
            data:[]
        };
    }	
    componentDidMount(){
    	// util.adaptHeight('cesiumContainer',105,300);//高度自适应
    	Cesium.BingMapsApi.defaultKey = 'AgiU9gCjKNfaR2yFSDfLw8e9zUlAYisRvRC2_L-LsGYN2bII5ZUvorfP3QJvxmjn';
    	let viewer = new Cesium.Viewer('cesiumContainer',{
    		animation:false,
    		baseLayerPicker:true,
    		fullscreenButton:false,
    		geocoder:false,
    		homeButton:false,
    		infoBox:false,
    		timeline:false,
    		navigationHelpButton:false,
    		navigationInstructionsInitiallyVisible:false
    	});
    	this.viewer = gVar.viewer = viewer;

		let {center,zoom} = this.props;

    	viewer.camera.setView({
        	destination: Cesium.Cartesian3.fromDegrees(center[1], center[0],1000),
	        orientation: {
	            heading : 0,  //左右偏移
	            pitch : 0,   //上下偏移
	            roll : 0.0                           
	        }
    	});    	
    }
    render(){
    	return(
    		<div id="cesiumContainer"></div>
    	)
    }
}


export default CesiumMap;