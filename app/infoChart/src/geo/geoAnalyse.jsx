/**

 */


import React,{Component} from 'react';
import L from 'leaflet';
// import '../map/common/css/leaflet.css';
import  './common/css/leaflet.css';

// import isolines from '@turf/isolines';
// import pointGrid from '@turf/point-grid';
import {isolines,pointGrid,isobands} from '@turf/turf'

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
    	let {data} = props;
		if(!(data.properties&&data.features)){   //is not geojson
			data = util.genGeoJson(data);
		}    	
    	window.data = data;
		if(__DEV__) console.log('data:',data);

	var point = data;
	var breaks = [0, 100];
    var isoline_1 = isolines(point, 'value', 200, breaks);
    isoline_1.features.forEach(function(feature) {
        feature.properties["stroke"] = "#3288bd";
        feature.properties["stroke-width"] = 6;
    });

    var breaks = [200, 300];
    var isoline_2 = isolines(point, 'value', 200, breaks);
    isoline_2.features.forEach(function(feature) {
        feature.properties["stroke"] = "#99d594";
        feature.properties["stroke-width"] = 6;
    });

    var breaks = [400, 500];
    var isoline_3 = isolines(point, 'value', 200, breaks);
    isoline_3.features.forEach(function(feature) {
        feature.properties["stroke"] = "#e6f598";
        feature.properties["stroke-width"] = 6;

    });

    var breaks = [600, 700];
    var isoline_4 = isolines(point, 'value', 200, breaks);
    isoline_4.features.forEach(function(feature) {
        feature.properties["stroke"] = "#ffffbf";
        feature.properties["stroke-width"] = 6;
    });

    var breaks = [800, 900];
    var isoline_5 = isolines(point, 'value', 200, breaks);
    isoline_5.features.forEach(function(feature) {
        feature.properties["stroke"] = "#fee08b";
        feature.properties["stroke-width"] = 6;
    });

    var breaks = [1000, 1100];
    var isoline_6 = isolines(point, 'value', 200, breaks);
    isoline_6.features.forEach(function(feature) {
        feature.properties["stroke"] = "#fc8d59";
        feature.properties["stroke-width"] = 6;
    });
    var breaks = [2400, 3000, 4000,5000];
    var isoline_7 = isolines(point, 'value', 200, breaks);
    isoline_7.features.forEach(function(feature) {
        feature.properties["stroke"] = "#d53e4f";
        feature.properties["stroke-width"] = 6;
    });

    let layer = new L.geoJson(point).addTo(map);
    let layer1 = new L.geoJson(isoline_1).addTo(map);
    let layer2 = new L.geoJson(isoline_2).addTo(map);
    let layer3 = new L.geoJson(isoline_3).addTo(map);
    let layer4 = new L.geoJson(isoline_4).addTo(map);
    let layer5 = new L.geoJson(isoline_5).addTo(map);
    let layer6 = new L.geoJson(isoline_6).addTo(map);
    let layer7 = new L.geoJson(isoline_7).addTo(map);
	
		/*var lines = isolines(data,  [0, 20, 40, 80, 160],{zProperty: 'value'});
		let pointsLayer = new L.geoJson(data);
		let layer = new L.geoJson(lines);
		map.addLayer(pointsLayer);  	
		map.addLayer(layer);  	

		if(__DEV__) console.log('lines,lines1',lines);*/

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