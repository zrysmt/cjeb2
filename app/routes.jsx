import React from 'react';
import {Route,IndexRoute,Redirect} from 'react-router';

import gConfig from './component/common/gConfig';

import Home from './page/home/home';
import Indview from './page/indview/indview';
import Makemap from './page/makemap/makemap';
import Mapmod from './page/mapmod/mapmod';

let gConfigClass = new gConfig();

class App extends React.Component{
	render(){
		return(
			<div id="react-page">	
				{this.props.children}
			</div>				
		)
	}
}
//指标进入时候跳转到第一版本
const indviewEnter = (nextState,replace)=>{
	replace({ pathname: '/' });
	window.open(gConfigClass.getSiteObj().v1Url);
}

let routes = (
	<Route  path="/" component={App}>
		<IndexRoute component={Home}/>
		<Route path="/indview" component={Indview} onEnter={indviewEnter}>
			{/*<Redirect  from="/" to='/123'/>*/}
		</Route>
		<Route path="/makemap" component={Makemap}/>
		<Route path="/mapmod" component={Mapmod}/>
	</Route>
);

export default routes;