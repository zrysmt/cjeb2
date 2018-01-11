import './threeChart.scss';

import React,{Component} from 'react';
import CesiumMap from './cesiumMap';
import gVar from './global';
import WebGLGlobeDataSource from './webGLGlobeDataSource';

import util from './common/util.jsx';
import Eventful from './common/eventful.js';

class ThreeChart extends Component{
	constructor(props){
        super(props);
        this.state = {
        };
    }	
	componentDidMount(){
    	let viewer = gVar.viewer;
    	if(__DEV__) console.log(viewer);
    	let {dataUrl} =  this.props;

    	if(!viewer || !dataUrl) return;

    	let dataSource = new WebGLGlobeDataSource();
		dataSource.loadUrl(dataUrl).then(function() {

		    //After the initial load, create buttons to let the user switch among series.
		    function createSeriesSetter(seriesName) {
		        return function() {
		            dataSource.seriesToDisplay = seriesName;
		        };
		    }

		    for (let i = 0; i < dataSource.seriesNames.length; i++) {
		        let seriesName = dataSource.seriesNames[i];
		        Sandcastle.addToolbarButton(seriesName, createSeriesSetter(seriesName));
		    }
		});

		viewer.clock.shouldAnimate = false;
		viewer.dataSources.add(dataSource);
    }
    render(){
    	return(
    		<div>
    			<CesiumMap></CesiumMap>
    		</div>
    	)
    }    
}

export default ThreeChart;