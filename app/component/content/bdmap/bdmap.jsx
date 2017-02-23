/**
 * 百度地图结合Echarts模块
 */
import React from 'react';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';

import bdmapConfig from './bdmap-config';
import './bdmap.scss';

class Bdmap extends React.Component{

	componentDidMount(){
		this.myChart = echarts.init(document.getElementById("bdmap"));
		this.myChart.setOption(bdmapConfig);
	}

	render(){
		return(
			<div id='bdmap'></div>
		)
	}
}

export default Bdmap;