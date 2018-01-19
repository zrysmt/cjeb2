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
    
		if(__DEV__) console.log('data:',data);

		let point = data;
		let breaks = [];
			let breaksGap = 50;
			for (let i = 0; i < 100; i++) {
				breaks.push(i * breaksGap);
			}	

		let isolineData = isolines(point, 'value', 20, breaks);
		isolineData.features.forEach(function(feature) {
		    feature.properties["stroke"] = "#d53e4f";
		    feature.properties["stroke-width"] = 6;
		});

		let layer = new L.geoJson(point).addTo(map);
		let layer7 = new L.geoJson(isolineData).addTo(map);
	
		/*let lines = isolines(data,  [0, 20, 40, 80, 160],{zProperty: 'value'});
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