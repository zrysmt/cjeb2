/**

 */


import React,{Component} from 'react';
import L from 'leaflet';
// import '../map/common/css/leaflet.css';
import  './common/css/leaflet.css';

// import isolines from '@turf/isolines';
// import pointGrid from '@turf/point-grid';
import {interpolate,featureEach,isolines,pointGrid,isobands} from '@turf/turf'
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
    		case '':
    			
    			break;
    	}
    }
	initIsolines(props){
    	let map = gVar.map;
    	let {data,option} = props;
    	if(option && !option.show) return;
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
		console.log(isolinesColorGap);
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
		leafletLegend(map,{
			color:color,
			label:label
		});
		// points 
		this.genLeafletPoint(map,points,6)
		
    }    
    /**
     * [initIsolines2 3.14.3版本用法，没有进行插值]
     * @param  {[type]} props [description]
     */
    initIsolines2(props){
    	let map = gVar.map;
    	let {data,option} = props;
    	if(option && !option.show) return;
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
		leafletLegend(map,{
			color:color,
			label:label
		});
		// points 
		this.genLeafletPoint(map,points,6)
		
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