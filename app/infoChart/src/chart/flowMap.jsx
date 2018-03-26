import React, { Component } from 'react';

import Map3D from '../map/map3D';
import gVar from '../map/global';

class FlowMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }
    componentWillReceiveProps(props) {
        if(props.show) this.initChart(props);
    }
    initChart(props) {
        let { mapBind, data, links,dataCenter,option } = props;
        let viewer = null,
            map = null;

        let size = option && option.size ? option.size : 1;
        let heightScale = option && option.heightScale ? option.heightScale : 50;

        if (!data) console.warn('FlowMap data is required');

        if (mapBind == 'Map3D') {
            viewer = gVar.viewer;
        } else {
            this.map = map = gVar.map;
            this.initLeafletMap(data,links,dataCenter, option);
        }
    }
    initLeafletMap(data,links,dataCenter, option) {
        /*let nodes = {
            "type": "FeatureCollection",
            "features": []
        }
        let fea = {
            "type": "Feature",
            "id": "",
            "properties": {
                "LAT": '',
                "LON": ''
            },
            "geometry": { "type": "Point", "coordinates": [] }
        };
        data.forEach((item, index) => {
            fea.id = item.cityCode;
            fea.properties = Object.assign({}, item);
            fea.geometry.coordinates.push(item.lng, item.lat);

            nodes.features.push(fea);
        })*/
        if (__DEV__) console.log(data,links);
        let map = this.map;
        let layerGroup = L.layerGroup();
        let linksCenter = links[dataCenter];
        let max = 0;
        let size = option && option.size ? option.size : 5;
		let plOption = {
    		color: '#3388ff',
    		smoothFactor:5,
    		opacity:0.8,
        };    
        option = _.defaultsDeep({},plOption,option);

        if(layerGroup.getLayers().length > 0){
            this.map.removeLayer(layerGroup);
            layerGroup.clearLayers();
        } 

        linksCenter.forEach((items,index)=>{
        	if((+items[1]) > max) max = +items[1];

			data.forEach((item1,index1)=>{
				if(dataCenter == item1.cityCode){
					items[2] = item1;
				}else if(items[0] == item1.cityCode){
	        		items[3] = item1;
	        	}
	        })        	
        })

        linksCenter.forEach((items,index)=>{
        	if(items.length !== 4) return;
        	let latlngs = [
        		[items[2].lat,items[2].lng],
        		[items[3].lat,items[3].lng]
        	]
        	option.weight = items[1] / max * 5 * size;
        	let polyline = L.polyline(latlngs, option);
        	layerGroup.addLayer(polyline);
        })
       
        layerGroup.addTo(map);
    }
    componentDidMount() {

    }

    render() {

        return ( 
        	<div id = "default-flow-map" >

            </div>
        )
    }
}


export default FlowMap;