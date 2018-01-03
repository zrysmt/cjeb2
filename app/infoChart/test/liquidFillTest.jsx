import React from 'react';
import {LiquidChart} from '../src/index';

class LiquidFillTest extends React.Component{
	render(){
		let text1 = '这是个简单的测试';
		return(
			<div >	
				<LiquidChart keyValue='lc1' data='0.21' text={text1} />
			</div>				
		)
	}
}

export default LiquidFillTest;