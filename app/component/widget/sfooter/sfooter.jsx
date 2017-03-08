/**
 * 窄的footer small footer
 * @Date 2017-03-08
 */
import React from 'react';

import './sfooter.scss';

class SFooter extends React.Component{
	render(){
		return(
			<div id="sfooter" >
				<div id="sfooter-div">
					<div>copyright© 华东师范大学城市发展研究院. &nbsp;&nbsp;All rights reserved 技术支持：华东师范大学教育部GIS重点实验室</div>
				</div>
			</div>
		)
	}
}

export default SFooter;