/**
 * 功能说明模块整体
 */

import React from 'react';
import Homefunc from '../../component/content/homefunc/homefunc';

let hfs;
hfs = [{
		id:"hf1",	
		title:"提升长江黄金水道功能",
		span1:"增强干线航运能力",
		span2:"加强集疏运体系建设",
		span3:"改善支流通航条件",
		span4:"扩大三峡枢纽通过能力",
		span5:"优化港口功能布局",
		span6:"合理布局过江通道",
		span7:"健全智能服务和安全保障系统",
		imgUrl:"imgs/1.png",
		style:{width:"200px",height:"100px",flexDirection:"row"}
	},{
		id:"hf2",		
		title:"建设综合立体交通走廊",
		span1:"形成快速大能力铁路通道",
		span2:"建设高等级广覆盖公路网",
		span3:"推进航空网络建设",
		span4:"完善油气管道布局",
		span5:"建设综合交通枢纽",
		span6:"加快发展多式联运",
		imgUrl:"imgs/2.png",
		style:{width:"150px",height:"150px",flexDirection:"row-reverse"}

	},{
		id:"hf3",		
		title:"创新驱动促进产业转型升级",
		span1:"增强自主创新能力",
		span2:"推进信息化与产业融合发展",
		span3:"培育世界级产业集群",
		span4:"加快发展现代服务业",
		span5:"打造沿江绿色能源产业带",
		span6:"提升现代农业和特色农业发展水平",
		span7:"引导产业有序转移和分工协作",
		imgUrl:"imgs/3.png",
		style:{width:"150px",height:"130px",flexDirection:"row"}
	},{
		id:"hf4",		
		title:"全面推进新型城镇化",
		span1:"优化沿江城镇化格局",
		span2:"提升长江三角洲城市群国际竞争力",
		span3:"培育发展长江中游城市群",
		span4:"促进成渝城市群一体化发展",
		span5:"推动黔中和滇中区域性城市群发展",
		span6:"科学引导沿江城市发展",
		span7:"强化城市群交通网络建设",
		span8:"创新城镇化发展体制机制",
		imgUrl:"imgs/4.png",
		style:{width:"200px",height:"100px",flexDirection:"row-reverse"}

	},{
		id:"hf5",		
		title:"培育全方位对外开放新优势",
		span1:"发挥上海对沿江开放的引领带动作用",
		span2:"增强云南面向西南开放重要桥头堡功能",
		span3:"加强与丝绸之路经济带的战略互动",
		span4:"推动对外开放口岸和特殊区域建设",
		span5:"构建长江大通关体制",
		imgUrl:"imgs/5.png",
		style:{width:"200px",height:"150px",flexDirection:"row"}
	},{
		id:"hf6",		
		title:"建设绿色生态廊道",
		span1:"切实保护和利用好长江水资源",
		span2:"严格控制和治理长江水污染",
		span3:"妥善处理江河湖泊关系",
		span4:"加强流域环境综合治理",
		span5:"强化沿江生态保护和修复",
		span6:"促进长江岸线有序开发",
		imgUrl:"imgs/6.png",
		style:{width:"200px",height:"150px",flexDirection:"row-reverse"}
	},{
		id:"hf7",		
		title:"创新区域协调发展体制机制",
		span1:"建立区域互动合作机制",
		span2:"推进一体化市场体系建设",
		span3:"加大金融合作创新力度",
		span4:"建立生态环境协同保护治理机制",
		span5:"建立公共服务和社会治理协调机制",
		imgUrl:"imgs/7.png",
		style:{width:"200px",height:"100px",flexDirection:"row"}
	}];

class Homefuncpage extends React.Component{
	render(){
		return(
			<div className="ho-func-divs">
				{
					hfs.map((hf)=>{
						return(
							<Homefunc hfObj={hf} key={hf.id} imgUrl={hf.imgUrl}/>
						)
					})
				}
			</div>
		)
	}
}



export default Homefuncpage;