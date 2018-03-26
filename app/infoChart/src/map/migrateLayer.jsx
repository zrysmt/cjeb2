import React, {Component} from 'react';
import L from 'leaflet';
import lodash from 'lodash';

/*import {config} from './migrateConfig.js';
import echarts from 'echarts';
import "./common/leaflet-plugin/leaflet-echarts3";*/
import "./common/leaflet-plugin/migrateLayer";

import gVar from './global';

class MigrateLayer extends Component {
    constructor(props) {
        super(props);
        // this.state = {};
    }

    componentWillReceiveProps(props) {
        if(props.show) this.initChart(props);
    }

    initChart(props) {
        let {mapBind, data, option} = props;
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
        let map = this.map;
        let defaultOption = {
            map: map,
            data: data,
            pulseRadius:30,
            pulseBorderWidth:3,
            arcWidth:1,
            arcLabel:true,
            arcLabelFont:'10px sans-serif',
        };
        option = _.defaultsDeep({},defaultOption,option);
        let migrationLayer = new L.migrationLayer(option);
        migrationLayer.addTo(map);

    }


    render() {

        return (
            <div id="default-migrate-layer"></div>
        )
    }
}

export default MigrateLayer;
