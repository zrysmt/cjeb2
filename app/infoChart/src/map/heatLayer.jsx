import React, { Component } from 'react';
import L from 'leaflet';
import './common/leaflet-plugin/HeatLayer.js'; //Leaflet.heat

import util from './common/util.jsx';
import Eventful from './common/eventful.js';

import gVar from './global';

class HeatLayer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(props) {
        if(props.show) this.initChart(props);
    }
    initChart(props) {
        let { mapBind, data,option } = props;
        let viewer = null,
            map = null;

        if (!data) console.warn('FlowMap data is error');

        if (mapBind == 'CesiumMap') {
            viewer = gVar.viewer;
        } else {
            this.map = map = gVar.map;
            this.initLeafletMap(data, option);
        }
    }
    initLeafletMap(data, option) {
    	let map  = this.map;

        data = data.map((p) => {
            return [p[0], p[1]];
        });

        this.heatLayer = L.heatLayer(data);
        this.heatLayer.addTo(map);    	
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


export default HeatLayer;