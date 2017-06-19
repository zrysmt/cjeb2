/**
 * 可视化模块 leaflet底图
 * @Date 2017-6-19
 */
import './lbasemap.scss';

import React from 'react';
import L from 'leaflet';

import util from '../../../common/util.jsx';
import Eventful from '../../../common/eventful.js';

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
		let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});
		osm.addTo(map);
		L.control.scale().addTo(map); //比例尺	    	
    }
	render(){
		return(
			<div id="lmap">
			</div>
		)
	}
}

export default Lbasemap;