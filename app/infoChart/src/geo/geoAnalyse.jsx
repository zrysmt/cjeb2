/**

 */

import React,{Component} from 'react';
import L from 'leaflet';
import * as d3 from 'd3';
// import '../map/common/css/leaflet.css';
import  './common/css/leaflet.css';

// import isolines from '@turf/isolines';
// import pointGrid from '@turf/point-grid';
import {interpolate,featureEach,isolines,pointGrid,isobands,
	buffer,tin,voronoi} from '@turf/turf'
import leafletLegend from './common/js/leafletLegend';
import gVar from '../map/global';

import util from '../map/common/util.jsx';
import Eventful from '../map/common/eventful.js';

class GeoAnalyse extends Component{
	constructor(props){
        super(props);
        this.state = {
            
        };
    }
    componentWillReceiveProps(props){
    	let {type} = props;
    	switch(type) {
    		case 'isolines':
    			this.initIsolines(props);
    			break;
    		case 'buffer':
    			this.initBuffer(props);
    			break;
			case 'tin':
    			this.initTin(props);
    			break;   
    		case 'voronoi':
    			this.initVoronoi(props);
    			break;    		
    	}
    }
    initVoronoi(props){
		let map = gVar.map;
    	let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is null');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}     
		let points = data;
		let interColor = d3.interpolateRgb("steelblue", "brown");

		let voronoiOption  = Object.assign({},{},option.voronoi); 
		let voronoiPolygons = voronoi(points, voronoiOption);
		let voronoiLayer = new L.geoJson(voronoiPolygons,{
		    style: function (feature) {
			        return {
			        	color:'#99d594',
			        	fillColor:'#99d594',
			        	fillOpacity:0.6,
			        	weight: option.weight || 2
			        };
		    	}
			}).addTo(map);				
		// points 
		if(option.show.point) this.genLeafletPoint(map,points,6);				
    }
    initTin(props){
		let map = gVar.map;
    	let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is null');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}     
		let points = data;
		let interColor = d3.interpolateRgb("steelblue", "brown");

		let tinOption  = Object.assign({},{
				field: 'value',
				gap:500
			},option.tin); 
		let getPropertiesSum = (a)=> a.properties.a + a.properties.b +  a.properties.c;

		let tinedData = tin(points, tinOption.field); 
		//大小排序
		tinedData.features.sort((a,b)=>	getPropertiesSum(a) - getPropertiesSum(b));
		if(__DEV__) console.log('tinedData',tinedData); 
		let colors = option.tin.color;
		let laseTinDataSum = getPropertiesSum(tinedData.features[tinedData.features.length-1]);
		let getColorByFeature = (feature)=>{
			let average = getPropertiesSum(feature)/3;
			let index = Math.ceil(average/tinOption.gap);
			// console.log('index',index, colors[index]);
			if(index < 0) index = 0;
			if(colors  && index > colors.length) index = colors.length-1;
			return colors ? colors[index]:interColor(1/laseTinDataSum * index);
		}			
		let tinLayer = new L.geoJson(tinedData,{
			    style: function (feature) {
			        return {
			        	color:'#99d594',
			        	fillColor: getColorByFeature(feature),
			        	fillOpacity:0.6,
			        	weight: option.weight || 2
			        };
			    }
			}).addTo(map);			
		// points 
		if(option.show.point) this.genLeafletPoint(map,points,6);					 	
    }
    initBuffer(props){
		let map = gVar.map;
    	let {show,data,option} = props;  
		if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is null');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}     
		let points = data;
		let bufferOption  = Object.assign({},{units: 'kilometers'},option.buffer);
		let gapLength = bufferOption.gap.length;

		if(!Array.isArray(bufferOption.gap)) throw new Error('bufferOption.gap should be Array');
		bufferOption.gap.forEach((item,ind)=>{
			let buffered = buffer(points, item, bufferOption);
			buffered.features.forEach(function(feature,index) {
			    feature.properties["color"] = option.color[ind];
			    feature.properties["weight"] = option.weight[ind] ||3;
			});

			let bufferLayer = new L.geoJson(buffered,{
			    style: function (feature) {
			        return {
			        	color: feature.properties.color,
			        	weight: feature.properties["weight"]
			        };
			    }
			}).addTo(map);				
		});

		if(option.show.legend) 
			leafletLegend(map,{
				color:option.color.slice(0,gapLength) || option.buffer.color.slice(0,gapLength),
				label:option.buffer.label.slice(0,gapLength)
			});			
		// points 
		if(option.show.point) this.genLeafletPoint(map,points,6);		
    }
	initIsolines(props){
    	let map = gVar.map;
    	let {show,data,option} = props;
    	if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is null');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}    	
    
		let points = data;
		let breaks = [];
		let breaksGap = option.breaks.gap || 100;
		let len = option.breaks.numbers || 50;
		let color = option.color || ['#045A8D','#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'];
		let weight = option.weight || 3;
		let field = option.breaks.field || 'value';
		let label = [];
		for (let i = 0; i < len; i++) {
			breaks.push(i * breaksGap);
		}	

		featureEach(points, function(point) {
		    point.properties.solRad = Math.random() * 50;
		});
		let options = Object.assign({},{gridType: 'points', property: 'value', units: 'kilometers'},option.interpolate);
		let grid = interpolate(points, option.interpolate.cellSize||10, options);   //先插值

		let isolineData = isolines(grid, breaks, {zProperty: field});

		let isolinesColorGap = option.colorGap|| Math.ceil(isolineData.features.length / color.length);

		if(__DEV__) console.log('data:',data,isolineData);
	
		isolineData.features.forEach(function(feature,index) {
			if(index % isolinesColorGap === 0) label.push(feature.properties[field]);
		    feature.properties["color"] = color[Math.floor(index / isolinesColorGap)];
		    feature.properties["weight"] = weight;
		});

		let layer7 = new L.geoJson(isolineData,{
		    style: function (feature) {
		        return {
		        	color: feature.properties.color,
		        	weight: feature.properties["weight"]
		        };
		    }
		}).addTo(map);
		//lengend
		if(option.show.legend) 
			leafletLegend(map,{
				color:color,
				label:label
			});
		// points 
		if(option.show.point) this.genLeafletPoint(map,points,6);
		
    }    
    /**
     * [initIsolines2 3.14.3版本用法，没有进行插值]
     * @param  {[type]} props [description]
     */
    initIsolines2(props){
    	let map = gVar.map;
    	let {show,data,option} = props;
    	if(!show) return;
    	if(!data || data.length ===0) throw new Error('data is null');
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}    	
    
		let points = data;
		let breaks = [];
		let breaksGap = option.breaks.gap || 50;
		let len = option.breaks.numbers || 50;
		let color = option.color || ['#045A8D','#99d594','#e6f598','#ffffbf','#fc8d59','#d53e4f'];
		let weight = option.weight || 3;
		let field = option.breaks.field || 'value';
		let label = [];
		for (let i = 0; i < len; i++) {
			breaks.push(i * breaksGap);
		}	

		let isolineData = isolines(points, field, 20, breaks);
		let isolinesColorGap = Math.ceil(isolineData.features.length / color.length);

		if(__DEV__) console.log('data:',data,isolineData);

		isolineData.features.forEach(function(feature,index) {
			if(index % isolinesColorGap === 0) label.push(feature.properties[field]);
		    feature.properties["color"] = color[Math.floor(index / isolinesColorGap)];
		    feature.properties["weight"] = weight;
		});

		let layer7 = new L.geoJson(isolineData,{
		    style: function (feature) {
		        return {
		        	color: feature.properties.color,
		        	weight: feature.properties["weight"]
		        };
		    }
		}).addTo(map);
		//lengend
		if(option.show.legend) 
			leafletLegend(map,{
				color:color,
				label:label
			});
		// points 
		if(option.show.point) this.genLeafletPoint(map,points,6)
		
    }

    genLeafletPoint(map,points,size = 6){
    	let pointLayerGroup = L.layerGroup();

		let myIcon = L.icon({
		    iconUrl: require('./common/imgs/point.png'),
		    iconSize: [size, size]
		});
		points.features.forEach((item,index)=>{
			let lat = item.properties.lat,
				lng = item.properties.lng;
			if(lat && lng)
				pointLayerGroup.addLayer(L.marker([lat,lng],{icon: myIcon}));
		})
		pointLayerGroup.addTo(map);    	
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

export default GeoAnalyse;