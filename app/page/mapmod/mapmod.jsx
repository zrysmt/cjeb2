import React from 'react';

import Header from '../../component/widget/header/header';
import Olbasemap from '../../component/content/olmap/olbasemap';

import './mapmod.scss';

class Mapmod extends React.Component{
	render(){
		return(
			<div id="map-page">
				<Header/>
				<div className="margin-top-header">
					<Olbasemap/>
				</div>
			</div>
		)
	}
}

export default Mapmod;