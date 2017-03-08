import React from 'react';

import Header from '../../component/widget/header/header';

class Makemap extends React.Component{
	render(){
		return(
			<div id="makemap">
				<Header/>
				<div className="margin-top-header">
					这是综合制图
				</div>
			</div>
		)
	}
}

export default Makemap;