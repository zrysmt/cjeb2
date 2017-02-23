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
		if(__DEV__) console.info("componentDidMount");

		this.myChart = echarts.init(document.getElementById("homemap"));
        this.myChart.showLoading();
        util.getJson("/app/common/echarts/china.json").then((chinaJson)=>{
        	if(!chinaJson) return;

        	echarts.registerMap('china', chinaJson);
        	
			// if(__DEV__) console.log(chinaJson);

			util.getJson("/app/component/content/homemap/provInfo.json").then((provInfoJson)=>{
        		this.myChart.hideLoading();

				homemapEhartsConfig.series[0].tooltip.formatter = function(params) {
                	var info = provInfoJson.filter(function(item) {
                		return item.province.trim() == params.name;
            		})[0];
            			
                	if (typeof params.value == 'number' && info) {
                	    return params.name + '<br/>地理位置：' + info.geo_location + '<br/>省会：' + info.capital +
                	        '<br/>面积：' + info.area + '<br/>地区：' + info.district + '<br/>气候：' + info.climateType;
                	} else {
                	    return params.name;
                	}
            	};
			}).then(()=>{
            	this.initMap(homemapEhartsConfig);//即使没有获取也要初始化
			}).catch(()=>{
        		if(__DEV__) console.error("错误",error);
			})

        },(error)=>{
        	if(__DEV__) console.error("错误",error);
        })

      // window.onresize = this.initMap(homemapEhartsConfig);
	  
	}
	componentDidUpdate(){
		if(__DEV__) console.info("componentDidUpdate");
		window.onresize = ()=>{
			this.initMap(homemapEhartsConfig);
		}
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