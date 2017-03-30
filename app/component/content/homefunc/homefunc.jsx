/**
 * 首页功能说明模块
 */
import React from 'react';

import './homefunc.scss';

class Homefunc extends React.Component{
	render(){
		let hfObj,imgUrl,spanArr=[];
		hfObj = this.props.hfObj;
		// imgUrl = "./app/page/home/"+hfObj.imgUrl;
		imgUrl = "./"+hfObj.imgUrl;
		for(let key in hfObj){
			if(key.includes("span")) spanArr.push(hfObj[key]);
		}
		return(
			<div className="ho-func-div">
				<div className="ho-func-title">
					<span>{hfObj.title}</span>
				</div>
				<div className="ho-func-content" style={{flexDirection:hfObj.style.flexDirection}}>
					<div className="content">
					{
						spanArr.map((item)=>{
							return <span key={Math.random()}>{item}</span>
						})
					}
					</div>
					<img alt="图片" src={require(imgUrl)} width={hfObj.style.width} height={hfObj.style.height}/>
				</div>
			</div>
		)
	}
}


export default Homefunc;