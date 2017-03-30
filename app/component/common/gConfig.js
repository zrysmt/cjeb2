/**
 * 全局的配置信息
 */
const projectName = "cjeb2";
// nav的菜单
const menuLis = [
	{id:1,title:"首页",enTitle:"home"},
	{id:2,title:"指标预览",enTitle:"indview"},
	{id:3,title:"综合制图",enTitle:"makemap"},
	{id:4,title:"地图模块",enTitle:"mapmod"}
];
const siteObj = {
	title:'"长江经济带"数据库平台',
	v1Url:"https://ccgis.cn/cjeb/",
	gTColor:"#48c78f",
	cBColor:"#3e3843",
	relativeUrl:"/cjeb/2/"
};
const echartsConfig={
	bgColor:"#003366",
	tColor:"#66cc99",
	hColor:"#339966"
};
class gConfig{
	getMenuLis(){
		return menuLis;
	}
	getSiteObj(){
		return siteObj;
	}
	getProjectName(){
		return projectName;
	}
	getEchartsConfig(){
		return echartsConfig;
	}
}

export default gConfig;