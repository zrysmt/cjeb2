import React from 'react';

import Header from '../../component/widget/header/header';
import SFooter from '../../component/widget/sfooter/sfooter';
import Lmap from '../../component/content/lmap/lmap';

class Makemap extends React.Component{
	render(){
		return(
			<div id="makemap">
				<Header/>
				<div className="margin-top-header">
					<Lmap>
					</Lmap>
				</div>
				<SFooter/>
			</div>
		)
	}
}

export default Makemap;