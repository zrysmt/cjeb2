/**

 */

import React,{Component} from 'react';
import * as d3 from 'd3';
import Cesium from 'cesium/Cesium';

import {interpolate,featureEach,isolines,pointGrid,isobands,
	buffer,tin,voronoi,bbox,polygonize,polygon,
	intersect,union,difference} from '@turf/turf'
import leafletLegend from './common/js/leafletLegend';
import gVar from '../map/global';

import util from '../map/common/util.jsx';
import Eventful from '../map/common/eventful.js';

class GeoAnalyse3D extends Component{
	constructor(props){
        super(props);
        this.state = {
            
        };
    	
    }
    componentWillReceiveProps(props){
    	let {type} = props;
    	switch(type) {
    		case 'tin':
    			this.initTin(props);
    			break;
    		case 'tin3D':
    			this.initTin3D(props);
    			break;
    		case 'voronoi':
    			this.initVoronoi(props);
    			break;
			case 'voronoi3D':
    			this.initVoronoi3D(props);
    			break;    		
    	}
    }
    initVoronoi3D(props){
		let viewer = gVar.viewer;
		let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is required');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}     

		let voronoiOption  = Object.assign({},{bbox:bbox(data),opacity:0.5},option.voronoi); 
		let voronoiPolygons = voronoi(data, voronoiOption);
		let features = [];
		voronoiPolygons.features.forEach((item,index)=>{
			if(item&&(item.geometry||item.geometries)) {
				item.properties = Object.assign({},data.features[index].properties,item.properties)
				features.push(item);
			}
		})
		voronoiPolygons.features = features;   
		if(__DEV__) console.log('voronoiPolygons',voronoiPolygons);
		this.genCesiumPolygon3D(viewer,voronoiPolygons,voronoiOption);    	
    }
    initVoronoi(props){
		let viewer = gVar.viewer;
		let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is required');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}     

		let voronoiOption  = Object.assign({},{bbox:bbox(data),opacity:0.5},option.voronoi); 
		let voronoiPolygons = voronoi(data, voronoiOption);
		let features = [];
		voronoiPolygons.features.forEach((item,index)=>{
			if(item&&(item.geometry||item.geometries)) features.push(item);
		})
		voronoiPolygons.features = features;   
		if(__DEV__) console.log('voronoiPolygons',voronoiPolygons);
		this.genCesiumPolygon(viewer,voronoiPolygons,voronoiOption);

    	if(option.show.point) this.genCesiumPoint(viewer,data,voronoiOption);		 	
    }
    initTin3D(props){
		let viewer = gVar.viewer;
		let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is required');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		} 		
		let tinOption  = Object.assign({},{field: 'value',opacity:0.5,heightSize: 500},option.tin); 		
		let tinedData = tin(data, tinOption.field); 
		if(__DEV__) console.log('tinedData',tinedData);  

		this.genCesiumPolygon3D(viewer,tinedData,tinOption);
    }
    initTin(props){
		let viewer = gVar.viewer;
		let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is required');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		} 		
		let tinOption  = Object.assign({},{field: 'value',opacity:0.5},option.tin); 		
		let tinedData = tin(data, tinOption.field); 
		if(__DEV__) console.log('tinedData',tinedData); 

		this.genCesiumPolygon(viewer,tinedData,tinOption);

    	if(option.show.point) this.genCesiumPoint(viewer,data,tinOption);
    }
    genCesiumPolygon3D(viewer,data,option){
    	Cesium.Math.setRandomNumberSeed(0);
		let getPropertiesSum = (a)=> a.properties.a.getValue() + a.properties.b.getValue()
			 +  a.properties.c.getValue();

	    let promise = Cesium.GeoJsonDataSource.load(data);
	    promise.then((dataSource)=> {
	        viewer.dataSources.add(dataSource);

	        //Get the array of entities
	        let entities = dataSource.entities.values;
	        let colorHash = {};
	        for (let i = 0; i < entities.length; i++) {
	            //For each entity, create a random color based on the state name.
	            //Some states have multiple entities, so we store the color in a
	            //hash so that we use the same color for the entire state.
	            let entity = entities[i];
	            let id = entity._id;
	            let color = colorHash[id];
	            if (option.randomColor && !color) {
	                color = Cesium.Color.fromRandom({
	                    alpha : 1.0
	                });
	                colorHash[id] = color.withAlpha(option.opacity);
	            }
	            if(!option.randomColor){
	            	color = option.color ?  Cesium.Color.fromCssColorString(option.color) 
						: Cesium.Color.fromCssColorString('#00ff00'); 
	            }
	            //Set the polygon material to our random color.
	            entity.polygon.material = color.withAlpha(option.opacity);
	            //Remove the outlines.
	            entity.polygon.outline = false;
	            
	            entity.polygon.extrudedHeight = getPropertiesSum(entity) * option.heightSize;
	        }
	    }).otherwise((error)=>{
	        //Display any errrors encountered while loading.
	        throw new Error(error);
	    });
    }
    genCesiumPolygon(viewer,data,option){
		let color =  option.color ?  Cesium.Color.fromCssColorString(option.color) 
			: Cesium.Color.fromCssColorString('#045A8D');

		viewer.dataSources.add(Cesium.GeoJsonDataSource.load(data, {
        	stroke: color,
        	fill: color.withAlpha(option.opacity),
        	strokeWidth: 30,
    	}));    	
    }
    
    genCesiumPoint(viewer,data,option){
		let color =  option.markerColor ?  Cesium.Color.fromCssColorString(option.markerColor) 
			: Cesium.Color.fromCssColorString('#00ff00');    	
		viewer.dataSources.add(Cesium.GeoJsonDataSource.load(data, {
        	markerSize: option.markerSize || 10,
        	markerColor: color,
        	markerSymbol: option.markerSymbol||'',
    	}));    	
    }
    componentDidMount(){
    }
    
    
    componentWillUnmount(){
    	
    }
    
	render(){
		return(
			<div> 
			</div>
		)
	}
}

export default GeoAnalyse3D;