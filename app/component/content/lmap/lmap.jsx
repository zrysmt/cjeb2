/**
 * 可视化模块 leaflet实现
 * @Date 2017-6-19
 */
import '../../../common/css/leaflet.css';

import React from 'react';
import Lbasemap from './lbasemap';

class Lmap extends React.Component{
	render(){
		return(
			<div id="lmap">
				<Lbasemap>
				</Lbasemap>
			</div>
		)
	}
}

export default Lmap;