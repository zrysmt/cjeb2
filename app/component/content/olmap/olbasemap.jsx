/**
 * 基础地图模块
 * @Date 2017-3-8
 */
import React from 'react';
import ol from 'openlayers';

import util from '../../../common/util.jsx';

import 'openlayers/css/ol.css';
import './olbasemap.scss';

class Olbasemap extends React.Component{

	componentDidMount(){
		util.adaptHeight('map',105,300);//高度自适应
		let projection ;
		projection = ol.proj.get('EPSG:4326');
		let map = new ol.Map({
      	    target: 'map',
      	    layers: [
      	        new ol.layer.Tile({
      	        	// opacity:1,
      	        	source:new ol.source.WMTS({
       	        		// url:"http://t0.tianditu.com/vec_c/wmts",
       	        		url: 'http://demo.opengeo.org/geoserver/wms',
       	        		params: {LAYERS: 'nasa:bluemarble', VERSION: '1.1.1'}
       	        		// opacity:1,
       	        		// projection: projection,
      	      		})
      	        })
      	      
      	    ],
      	    view: new ol.View({
      	      projection: 'EPSG:4326',//WGS84
      	      center: ol.proj.fromLonLat([104, 30]),
      	      zoom: 5,
      	    })
      	});
		/*let map = new ol.Map({
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
      	});*/
	}
	render(){
		return(
			<div id="map"></div>
		)
	}
}

export default Olbasemap;