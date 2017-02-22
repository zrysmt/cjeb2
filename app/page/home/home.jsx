import React from 'react';

import Header from '../../component/widget/header/header';
import Homemap from '../../component/content/homemap/homemap';

class Home extends React.Component{
	render(){
		return(
			<div id="home-page">
				<Header/>
				<Homemap/>
			</div>
		)
	}
}

export default Home;

