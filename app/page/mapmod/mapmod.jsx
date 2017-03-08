import React from 'react';

import Header from '../../component/widget/header/header';
import SFooter from '../../component/widget/sfooter/sfooter';
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
				<SFooter/>
			</div>
		)
	}
}

export default Mapmod;