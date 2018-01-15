import './spaceCube.scss';

import React,{Component} from 'react';
import Cesium from 'cesium/Cesium';

import CesiumMap from './cesiumMap';
import util from './common/util.jsx';
import Eventful from './common/eventful.js';

import gVar from './global';

class SpaceCube extends Component{
	constructor(props){
        super(props);
        this.state = {
        };
      
    }	
	componentWillReceiveProps(props){
    	this.initChart(props);
    }    
    initChart(props){
    	let {data,option} = props;
    	let viewer = gVar.viewer;
    	let size = option.size ? option.size :1;
    	let heightScale = option.heightScale ? option.heightScale :50;
    	let material = null , outlineColor = null;
    	if(option.color) {
        	material = Cesium.Color.fromCssColorString(option.color);
	    }else{
	        material = Cesium.Color.fromCssColorString('#3366ff');
	    }
	    if(option.outlineColor) outlineColor = Cesium.Color.fromCssColorString(option.outlineColor);

    	for (let i = 0,len = data.length; i < len - 1; i++) {
    		let lat = +data[i].lat,
    			lng = +data[i].lng,
    			lat1 = +data[i + 1].lat,
    			lng1 = +data[i + 1].lng,
    			value = +data[i].value;
    		let height = value * size * heightScale;
    		let polySize = size * 3000;
    		if(!(lat && lng && lat1 && lng1 && value)) return;
    		
    		viewer.entities.add({
			    name : 'entities',
			    polylineVolume : {
			        positions : Cesium.Cartesian3.fromDegreesArrayHeights([lng, lat, 0,
			                                                              lng1, lat1,0]),
			        shape :[new Cesium.Cartesian2(-polySize, -height), // 第二位和下面的第二位控制高度
                		new Cesium.Cartesian2(polySize, -height), //
                		new Cesium.Cartesian2(polySize, polySize),
                		new Cesium.Cartesian2(-polySize, polySize)],
			        cornerType : Cesium.CornerType.BEVELED,
			        material : material,
					fill:option.fill||true,
                    outline:option.outline||false,
                    outlineColor:outlineColor			        
			    }
			});		
    	}
    }
    componentDidMount(){
    	
    }
    	
    render(){
    	let {center,height,viewerOption} = this.props;

    	return(
    		<div id="spaceCube">
				<CesiumMap
					height = {height}
    				center = {center}    
                    viewerOption = {viewerOption}				
    			></CesiumMap>    			
    		</div>
    	)
    }
}


export default SpaceCube;