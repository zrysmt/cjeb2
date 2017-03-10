/**
 * 基础地图模块
 * @Date 2017-3-8
 */
import React from 'react';
import ol from 'openlayers';

import 'openlayers/css/ol.css';
import './olbasemap.scss';

class Olbasemap extends React.Component{
	componentDidMount(){
		let map = new ol.Map({
      	    target: 'map',
      	    layers: [
      	      new ol.layer.Tile({
       	        source: new ol.source.OSM()
      	      })
      	    ],
      	    view: new ol.View({
      	      // projection: 'EPSG:4326',//WGS84
      	      center: ol.proj.fromLonLat([104, 30]),
      	      zoom: 5,
      	    })
      	});
	}
	render(){
		return(
			<div id="map"></div>
		)
	}
}

export default Olbasemap;