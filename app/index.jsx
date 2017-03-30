import React from 'react';
import ReactDOM from 'react-dom';
import {Router,hashHistory,useRouterHistory} from 'react-router';
import { createHashHistory } from 'history'

import routes from './routes';
import util from './common/util';
import gConfig from './component/common/gConfig';

import './component/common/global.scss';

// util.debounceAdapt();
util.adapt(640,100);//自动计算出来媒体查询
let gConfigClass = new gConfig();

let appHistory;
if(__WEBROOT__){
	appHistory = useRouterHistory(createHashHistory)({
		queryKey: false,//去掉地址栏的key
  		basename:  gConfigClass.getSiteObj().relativeUrl        // 根目录名
	});	
}else{
	appHistory = hashHistory;
} 




ReactDOM.render((
	<Router history={appHistory} routes={routes}>
	</Router>
	),document.getElementById("react-root")
);

