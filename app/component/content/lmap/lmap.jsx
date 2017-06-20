/**
 * 可视化模块 leaflet实现
 * @Date 2017-6-19
 *  mapType 地图类型
 *  osmGeocoder 是否显示osmGeocoder
 * <Lbasemap mapType="geoq_normalm3" scale="true" osmGeocoder="true">
 *	</Lbasemap>
 * 
 */
import '../../../common/css/leaflet.css';

import React from 'react';
import Lbasemap from './lbasemap';

class Lmap extends React.Component{
	render(){
		return(
			<div id="lmap">
				<Lbasemap mapType="geoq_normalm3"  scale="true" osmGeocoder="false" maptypebar="true">
				</Lbasemap>
			</div>
		)
	}
}

export default Lmap;