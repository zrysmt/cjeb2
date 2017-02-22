/**
 * 首页地图概览模块
 * 2017/02/21
 */
import React from 'react';
import echarts from 'echarts';

import util from '../../../common/util';
import gConfig from '../../common/gConfig';
import homemapEhartsConfig from './homemap-config.js'; 

import './homemap.scss';

class Homemap extends React.Component{
	/**
	 * [componentDidMount 已经插入真实DOM]
	 */
	componentDidMount(){
		this.myChart = echarts.init(document.getElementById("homemap"));
        this.myChart.showLoading();
        util.getJson("/app/common/echarts/china.json").then((chinaJson)=>{
        	this.myChart.hideLoading();
        	echarts.registerMap('china', chinaJson);
        	
			if(__DEV__) console.info(chinaJson);

            this.initMap(homemapEhartsConfig);
        },function(error){
        	if(__DEV__) console.error("错误",error);
        })
	}
	initMap(option){
		this.myChart.setOption(option);
	}
	render(){
		return(
			<div id="homemap"></div>
		)
	}
}

export default Homemap;