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
	LiquidFillTest,PieChartTest,BarChartTest,RadarChartTest,Map3DTest,
	Chart3DTest,Chart3DTest2,SpaceCubeTest,FlowMapTest,HeatLayerTest,
	ThematicMapTest,MigrateTest,TimeLineTest ,GeoAnalyseTest,GeoAnalyse3DTest,ParallelTest}
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
/*
/geo1
/geo2 多种情况可测试
 */
let routes = (
	<Route  path="/" component={App}>
		<IndexRoute component={Home}/>
		<Route path="/indview" component={Indview} onEnter={indviewEnter}>
			{/*<Redirect  from="/" to='/123'/>*/}
		</Route>
		<Route path="/twothreemap" component={Twothreemap}/>
		<Route path="/makemap" component={Makemap}/>
		<Route path="/mapmod" component={Mapmod}/>
		
		<Route path="/lf" component={LiquidFillTest}/>
		<Route path="/ic" component={LMapTest}/>
		<Route path="/sc" component={ScatterChartTest}/>
		<Route path="/ssc" component={SvgScatterChartTest}/>
		<Route path="/ssc2" component={SvgScatterChartTest2}/>
		<Route path="/pc" component={PieChartTest}/>
		<Route path="/bc" component={BarChartTest}/>

		<Route path="/cm" component={Map3DTest}/>
		<Route path="/cm1" component={Chart3DTest}/>
		<Route path="/cm2" component={Chart3DTest2}/>
		<Route path="/space" component={SpaceCubeTest}/>
		<Route path="/flowmap" component={FlowMapTest}/>
		<Route path="/heatlayer" component={HeatLayerTest}/>
		<Route path="/thematic" component={ThematicMapTest}/>
		<Route path="/migrate" component={MigrateTest}/>
		<Route path="/timeline" component={TimeLineTest}/>

		<Route path="/parallel" component={ParallelTest}/>

		<Route path="/geo1" component={GeoAnalyseTest}/>  
		<Route path="/geo2" component={GeoAnalyse3DTest}/>
	</Route>
);

export default routes;