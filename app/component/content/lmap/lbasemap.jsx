/**
 * 可视化模块 leaflet底图
 * @Date 2017-6-19
 */
import './lbasemap.scss';

import React from 'react';
import L from 'leaflet';

import "../../../common/css/Control.OSMGeocoder.css";
import "../../../common/leaflet-plugin/Control.OSMGeocoder.js";

import util from '../../../common/util.jsx';
import Eventful from '../../../common/eventful.js';

import mapTypes from './maptypes.js';

class Lbasemap extends React.Component{
	constructor(props){
        super(props);

    }
    componentWillMount(){
    }
    componentDidMount(){
        if(__DEV__) console.info("componentDidMount");
		util.adaptHeight('lmap',105,300);//高度自适应

		let map = L.map('lmap',{
			crs:L.CRS.EPSG3857 //默认墨卡托投影 ESPG：3857
		});
		let center = this.props.center||[30,104];
		let zoom =  this.props.zoom||5;
		map.setView(center,zoom); 
		this.map = map;
		let mapTypeProps = this.props.mapType;
		if(!mapTypeProps){
			let osm = mapTypes.osm;
			osm.addTo(map);
		}else{
			let type = mapTypes[mapTypeProps];
			type.addTo(map);
		}
			   
		let editableLayers = new L.FeatureGroup();
		let drawnItems = editableLayers.addTo(map); 

		if(this.props.scale&&this.props.scale==="true") L.control.scale().addTo(map); //比例尺
		if(this.props.osmGeocoder&&this.props.osmGeocoder==="true") this.osmGeocoderGen();
	
    }
    componentWillUnmount(){
    	this.map.remove();
    }
    osmGeocoderGen(){
    	let osmGeocoder = new L.Control.OSMGeocoder({
    		collapsed: false,
    		position: 'topright',
    		text: 'Search',
		});
		osmGeocoder.addTo(map);
    }
	render(){
		return(
			<div id="lmap">
			</div>
		)
	}
}

export default Lbasemap;