/**
 * 二三维联动
 */
import './twothreedim.scss';

import React from 'react';
import Lbasemap from '../lmap/lbasemap';
import Threemap from '../threemap/threemap';

class Twothreedim extends React.Component{
	render(){
		return(
			<div id="twothreedim" className="left-right-container">
				<div id="twodim" className="left-container">
					<Lbasemap mapType="geoq_normalm3"  scale="true" osmGeocoder="false" maptypebar="true" center={[30,110]} zoom={4}>
					</Lbasemap>
				</div>
				<div id="threedim" className="right-container">
					<Threemap center={[30,110]} zoom={4}/>
				</div>
			</div>
		)
	}
}

export default Twothreedim;