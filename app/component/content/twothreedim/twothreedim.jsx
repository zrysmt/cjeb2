/**
 * 二三维联动
 */
import './twothreedim.scss';

import React from 'react';
import Twomap from '../twomap/twomap';
import Threemap from '../threemap/threemap';

class Twothreedim extends React.Component{
	render(){
		return(
			<div id="twothreedim" className="left-right-container">
				<div id="twodim" className="left-container">
					<Twomap/>S
				</div>
				<div id="threedim" className="right-container">
					<Threemap center={[30,110]} zoom={4}/>
				</div>
			</div>
		)
	}
}

export default Twothreedim;