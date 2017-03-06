import React from 'react';

import Header from '../../component/widget/header/header';
import Footer from '../../component/widget/footer/footer';
import Homemap from '../../component/content/homemap/homemap';
import Bdmap from '../../component/content/bdmap/bdmap';
import LiquidChart from '../../component/content/liquidchart/liquidchart';

import Homefuncpage from './homefuncpage';

import './home.scss';

class Home extends React.Component{
	render(){
		let style = {},text1,text2,text3,text4,text5;
		style = {
			width:"130px",
			height:"130px"
		};
		text1 = "面积约205万平方公里，占全国的21%";
		text2="人口和经济总量均超过全国的40%";
		text3="城镇化率达到60%以上";
		text4="深林覆盖率达到43%";

		return(
			<div id="home-page">
				<Header/>
				<Homemap/>
				<div id="ho-intro">
					<Bdmap/>
					<div id="ho-intro-l">
						<LiquidChart keyValue='lc1' data='0.21' text={text1} style={style}/>
						<LiquidChart keyValue='lc2' data='0.4' text={text2} style={style}/>
					</div>
					<div id="ho-intro-r">
						<LiquidChart keyValue='lc3' data='0.6' text={text3} style={style}/>
						<LiquidChart keyValue='lc4' data='0.43' text={text4} style={style}/>
					</div>
				</div>
				<div id="ho-func">
					<Homefuncpage/>
				</div>
				<Footer/>
			</div>
		)
	}
}

export default Home;

