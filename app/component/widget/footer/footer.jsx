/**
 * footer
 * @Date 2017-03-06
 */
import React from 'react';

import './footer.scss';

class Footer extends React.Component{
	static get defaultProps(){
		return {
			height:'130px'
		}
	}
	render(){
		return(
			<div id="footer" style={{height:this.props.height}}>
				<div id="footer-div">
					<div id="copyrgt">copyright© 华东师范大学城市发展研究院. &nbsp;&nbsp;All rights reserved 技术支持：华东师范大学教育部GIS重点实验室</div>
					<div id="address">上海市中山北路3663号华东师范大学地理馆308（200062）&nbsp;电话：+86-21-62232980 &nbsp;邮箱：office@iud.ecnu.edu.cn</div>
				</div>
			</div>
		)
	}
}

export default Footer;