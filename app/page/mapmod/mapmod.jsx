/**
 * 地图模块
 */
import React from 'react';

import Header from '../../component/widget/header/header';
import SFooter from '../../component/widget/sfooter/sfooter';
import Olmap from '../../component/content/olmap/olmap';

import './mapmod.scss';

class Mapmod extends React.Component{
	render(){
		return(
			<div id="map-page">
				<Header/>
				<div className="margin-top-header">
					<Olmap/>
				</div>
				<SFooter/>
			</div>
		)
	}
}

export default Mapmod;