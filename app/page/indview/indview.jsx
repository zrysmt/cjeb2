import React from 'react';

import Header from '../../component/widget/header/header';

import './indview.scss';

class IndviewIframe extends React.Component{
	render(){
		return(
			{/*<iframe id="iv-iframe" src="/app/cjeb/index.html" width="100%" height="550px" scrolling="no"></iframe>*/}

		)
	}
}


class Indview extends React.Component{
	render(){
		return(
			<div id="indview">
				<Header/>
			</div>
		)
	}
}

export default Indview;