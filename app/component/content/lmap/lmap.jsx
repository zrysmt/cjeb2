/**
 * 可视化模块 leaflet实现
 * @Date 2017-6-19
 *  mapType 地图类型
 *  scale  是否显示比例尺
 *  osmGeocoder 是否显示osmGeocoder
 *  maptypebar 是否显示地图切换按钮
 * <Map2D mapType="geoq_normalm3"  scale={true} osmGeocoder={false} maptypebar={true}>
 *	</Map2D>
 * 
 */
import '../../../common/css/leaflet.css';

import React from 'react';
import Map2D from './map2D';

class Lmap extends React.Component{
	render(){
		return(
			<div id="lmap">
				<Map2D mapType="geoq_normalm3"  scale={true} osmGeocoder={false} maptypebar={true}>
				</Map2D>
			</div>
		)
	}
}

export default Lmap;