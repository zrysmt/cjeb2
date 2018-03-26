import React, { Component } from 'react';
import L from 'leaflet';
import lodash from 'lodash';
import Autolinker from 'autolinker';


import gVar from '../map/global';
import chinaJson from '../common/data/china.json';

class ThematicMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(props) {
        if(props.show) this.initChart(props);
    }
    initChart(props) {
        let { mapBind, data,geojson,fieldId,classify,option } = props;
        let viewer = null,
            map = null;

        if (!data) console.warn('FlowMap data is error');
 
        if (mapBind == 'Map3D') {
            viewer = gVar.viewer;
        } else {
            this.map = map = gVar.map;
            this.initLeafletMap(data,geojson,fieldId,classify, option);
        }
    }
    initLeafletMap(data, geojson,fieldId,classify,option) {
    	let map  = this.map;
    	geojson = geojson ? geojson:chinaJson;

    	let colorArr = ['#FF99CC','#FF6699','#9999CC','#9966FF','#9900FF','#6600CC','#330066','#330033'] ;
    	
    	let classifyField = classify&&classify.field ? classify.field : 'value';
    	let classifyNums = classify&&classify.numbers ? classify.numbers : 5;
    	let classifyColor = classify&&classify.color ? classify.color : colorArr.slice(0,classifyNums);

    	let max = 0,min = +data[0][classifyField];
		data.forEach((item,index)=>{
        	if((+item[classifyField]) > max){
        		max = +item[classifyField];
        	}else if((+item[classifyField]) < min){
        		min = +item[classifyField];
        	}
        	geojson.features.forEach((item1,index1)=>{
        		if(item1.properties.NAME === item[fieldId]){
        			item1.properties = _.defaultsDeep({},item1.properties,item);
        		}
        	})	    	
        }) 

        let gap = classify&&classify.gap ? classify.gap :(max - min) / classifyNums;

		   	
        function pop_0(feature, layer) {
            let popupContent = `<table>
                <tr>
                    <td colspan="2">面积：${(feature.properties['AREA'] !== null ? Autolinker.link(String(feature.properties['AREA'])) : '') }</td>
                </tr>
                <tr>
                    <td colspan="2">周长：${(feature.properties['PERIMETER'] !== null ? Autolinker.link(String(feature.properties['PERIMETER'])) : '') }</td>
                </tr>
                <tr>
                    <td colspan="2">名称：${(feature.properties['NAME'] !== null ? Autolinker.link(String(feature.properties['NAME'])) : '') }</td>
                </tr>
                <tr>
                    <td colspan="2">value：${(feature.properties['value'] !== null ? Autolinker.link(String(feature.properties['value'])) : '') }</td>
                </tr>              
            </table>`;
            layer.bindPopup(popupContent);
        }

        function style_0(feature) {
            let style =  {
                pane: 'pane_0',
                opacity: 1,
                color:  'rgba(64,98,210,1)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 2.0,
                fillOpacity: 0.6,
                fillColor: 'rgba(64,98,210,1)'
            };
            if(option) style = _.defaultsDeep({},style,option);
            if(feature.properties[fieldId]){
            	// style.color = 'rgba(0,0,0,1)';
            	if(feature.properties[classifyField]){
            		let value  = +feature.properties[classifyField];
            		let index = Math.floor((value - min) /gap);
            		if(value < min){
            			index = 0;
            		}else if(value >= max){
            			index = classifyNums - 1;
            		}
					style.fillColor = classifyColor[index];
            	}
            }else{
            	style.fillOpacity = 0;
            	// style.fillColor = 'rgba(64,98,210,0)';
            }
            return style;
        }
        map.createPane('pane_0');
        map.getPane('pane_0').style.zIndex = 400;
        map.getPane('pane_0').style['mix-blend-mode'] = 'normal';
        let layer_0 = new L.geoJson(geojson, {
            attribution: '<a href=""></a>',
            pane: 'pane_0',
            onEachFeature: pop_0,
            style: style_0
        });

        map.addLayer(layer_0);  	

    }
    componentDidMount() {

    }

    render() {

        return ( 
        	<div id = "default-heat-layer" >
            </div>
        )
    }
}


export default ThematicMap;