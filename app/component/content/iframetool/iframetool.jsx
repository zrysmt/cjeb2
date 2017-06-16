/**
 * 订制的iframe组件
 * @Date 2017-06-16
 */ 
import 'iframetool.scss';

import React from 'react';

class IframeTool extends React.Component{
	componentDidMount(){
		
	}
	render(){
		return{
			<iframe src = {this.props.url}>
			
			</iframe>
		}
	}
}

export default IframeTool;