import React from 'react';
import {Link} from 'react-router';

const ExampleList = ()=>(
    <div style={{}}>
        <ul>
            <li><Link to={`/lf`} activeClassName="active" >水滴图 LiquidFill</Link></li>
            <li><Link to={`/ic`} >散点图</Link></li>
            <li><Link to={`/sc`} >带有相对大小的散点图</Link></li>
            <li><Link to={`/ssc`} >单个svg图片的多散点图</Link></li>
            <li><Link to={`/ssc2`} >多svg图片的多散点图</Link></li>
            <li><Link to={`/pc`} >饼状图</Link></li>
            <li><Link to={`/bc`} >柱状图</Link></li>
            <li><Link to={`/cm`} >三维地图</Link></li>
            <li><Link to={`/cm1`} >三维柱状图</Link></li>
            <li><Link to={`/cm2`} >三维多柱状图</Link></li>
            <li><Link to={`/space`} >时空立方体</Link></li>
            <li><Link to={`/flowmap`} >Flow Map</Link></li>
            <li><Link to={`/heatlayer`} >热力图</Link></li>
            <li><Link to={`/thematic`} >专题图</Link></li>
            <li><Link to={`/migrate`} >迁徙图</Link></li>
            <li><Link to={`/timeline`} >带有时间线的饼状图</Link></li>
            <li><Link to={`/parallel`} >平行坐标系图</Link></li>
        </ul>
    </div>
)


export default ExampleList