import './chart3D.scss';

import React,{Component} from 'react';
import Cesium from 'cesium/Cesium';

import CesiumMap from './cesiumMap';
import gVar from './global';
import WebGLGlobeDataSource from './webGLGlobeDataSource';

import util from './common/util.jsx';
import Eventful from './common/eventful.js';

class Chart3D extends Component{
	constructor(props){
        super(props);
        this.state = {
        };
    }	
    componentWillReceiveProps(props){
    	this.initChart(props);
    }
	componentDidMount(){
		
    }
    initChart(props){
		let viewer = gVar.viewer;
    	if(__DEV__) console.log(viewer);
    	let {dataUrl,dataName,type,option} =  props;
    	option.type = type;
    	if(!viewer) return;
        if(__DEV__) console.log('option',option);

    	let dataSource = new WebGLGlobeDataSource();
    	if(dataUrl){
			dataSource.loadUrl(dataUrl,dataName,option).then(function() {
			    //After the initial load, create buttons to let the user switch among series.
			    /*function createSeriesSetter(seriesName) {
			        return function() {
			            dataSource.seriesToDisplay = seriesName;
			        };
			    }

			    for (let i = 0; i < dataSource.seriesNames.length; i++) {
			        let seriesName = dataSource.seriesNames[i];
			        Sandcastle.addToolbarButton(seriesName, createSeriesSetter(seriesName));
			    }*/
			});    		
    	}
		

		viewer.clock.shouldAnimate = false;
		viewer.dataSources.add(dataSource);    	
    }
    render(){

    	return(
    		<div></div>
    	)
    }    
}

export default Chart3D;