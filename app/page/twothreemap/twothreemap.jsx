/**
 * 二三维联动模块
 * @Date 20170629
 */
import React from 'react';

import Header from '../../component/widget/header/header';
import SFooter from '../../component/widget/sfooter/sfooter';
import Twothreedim from '../../component/content/twothreedim/twothreedim';

import './twothreemap.scss';

class Twothreemap extends React.Component{
	render(){
		return(
			<div id="twothreemap-page">
				<Header/>
				<div className="margin-top-header">
					<Twothreedim/>
				</div>
				<SFooter/>
			</div>
		)
	}
}

export default Twothreemap;