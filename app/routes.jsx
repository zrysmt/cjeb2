import React from 'react';
import {Route,IndexRoute,Redirect} from 'react-router';

import gConfig from './component/common/gConfig';

import Home from './page/home/home';
import Indview from './page/indview/indview';
import Makemap from './page/makemap/makemap';
import Mapmod from './page/mapmod/mapmod';
import Twothreemap from './page/twothreemap/twothreemap';

//测试infoChart
import {LMapTest,ScatterChartTest,SvgScatterChartTest,SvgScatterChartTest2,
	LiquidFillTest,PieChartTest,BarChartTest,RadarChartTest,CesiumMapTest,
	ThreeChartTest,ThreeChartTest2,SpaceCubeTest,FlowMapTest,HeatLayerTest,
	ThematicMapTest,TimeLineTest}
    from './infoChart/test/index';

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
		<Route path="/twothreemap" component={Twothreemap}/>
		<Route path="/makemap" component={Makemap}/>
		<Route path="/mapmod" component={Mapmod}/>
		
		<Route path="/ic" component={LMapTest}/>
		<Route path="/sc" component={ScatterChartTest}/>
		<Route path="/ssc" component={SvgScatterChartTest}/>
		<Route path="/ssc2" component={SvgScatterChartTest2}/>
		<Route path="/pc" component={PieChartTest}/>
		<Route path="/bc" component={BarChartTest}/>

		<Route path="/cm" component={CesiumMapTest}/>
		<Route path="/cm1" component={ThreeChartTest}/>
		<Route path="/cm2" component={ThreeChartTest2}/>
		<Route path="/space" component={SpaceCubeTest}/>
		<Route path="/flowmap" component={FlowMapTest}/>
		<Route path="/heatlayer" component={HeatLayerTest}/>
		<Route path="/thematic" component={ThematicMapTest}/>
		<Route path="/timeline" component={TimeLineTest}/>
	</Route>
);

export default routes;