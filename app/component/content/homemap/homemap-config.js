/**
 * 首页echarts的配置
 */
import gConfig from '../../common/gConfig';

let gConfigClass,gTColor,echartsConfig,echartsBgColor,
echartsTColor,echartsHColor,itemStyle={},dataItemStyle={},dataLabel={},geoCoorMap={},option={};

gConfigClass = new gConfig();
gTColor = gConfigClass.getSiteObj().gTColor;//主题色
echartsConfig = gConfigClass.getEchartsConfig();//echarts全局配置
echartsBgColor = echartsConfig.bgColor||'#003366';
echartsTColor = echartsConfig.tColor||'#66cc99';
echartsHColor = echartsConfig.hColor||'#339966';

dataItemStyle = { 
    normal: { areaColor: echartsTColor } , 
    emphasis: {areaColor: echartsHColor} 
};
itemStyle = {
    normal: { areaColor: '#eee' } , 
    emphasis: {areaColor: echartsHColor} 
};

dataLabel = {
    normal:{show:true,textStyle:{color:'#eee'}}
};

geoCoorMap = [
	{name:'上海',coord: [121.4648,31.2891]},{name:'南京',coord: [118.8062,31.9208]},
	{name:'成都',coord: [103.9526,30.7617]},{name:'武汉',coord: [114.3896,30.6628]},
    {name:'重庆',coord: [107.7539,30.1904]}
];
 
option = {
    backgroundColor: echartsBgColor,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    color: ['rgba(30,144,255,1)', 'lime'],
    tooltip: {
        trigger: 'item',
        formatter: '{b}'
    },
    toolbox: {
        show: false,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
        }
    },
    /*graphic:[{
        type: 'group',
        id: 'textGroup1',
        right: '30%',
        top: '29%',
        bounding: 'raw',
        children: [
            {
                type: 'circle',
                z: 100,
                left: 'center',
                top: 'center',
                shape: {
                    cx: 50,
                    cy: 100,
                    r:50
                },
                style: {
                    fill: 'rgba(0,255,255,0.2)',
                    stroke: '#999',
                    lineWidth: 1
                }
            },
            {
                type: 'rect',
                z: 101,
                left: 'center',
                bottom: 0,
                shape: {
                    width: 100,
                    height: 14
                },
                style: {
                    fill: '#f00',
                    stroke: '#999',
                    lineWidth: 1
                }
            },
            {
                type: 'text',
                z: 102,
                bottom: 0,
                left: 'center',
                style: {
                    text: [
                        '下游长三角地区',
                    ].join('\n'),
                    font: '14px "STHeiti", sans-serif'
                }
            }
        ]
    }],*/
    series: [
    {
        name: '长江经济带',
        type: 'map',
        roam: false,
        center: [112, 28],
        zoom: 3,
        mapType: 'china',
        tooltip: {
            trigger: 'item',
        },
        itemStyle: itemStyle,
        data: [
            { name: '江苏', value: 1, itemStyle: dataItemStyle,label:dataLabel },
            { name: '浙江', value: 2, itemStyle: dataItemStyle,label:dataLabel },
            { name: '安徽', value: 3, itemStyle: dataItemStyle,label:dataLabel },
            { name: '江西', value: 4, itemStyle: dataItemStyle,label:dataLabel },
            { name: '湖北', value: 5, itemStyle: dataItemStyle,label:dataLabel },
            { name: '湖南', value: 6, itemStyle: dataItemStyle,label:dataLabel },
            { name: '四川', value: 7, itemStyle: dataItemStyle,label:dataLabel },
            { name: '云南', value: 8, itemStyle: dataItemStyle,label:dataLabel },
            { name: '贵州', value: 9, itemStyle: dataItemStyle,label:dataLabel },
            { name: '上海', value: 10, itemStyle: dataItemStyle,label:dataLabel },
            { name: '重庆', value: 11, itemStyle: dataItemStyle,label:dataLabel },
        ],
        markPoint:{
            symbol:"pin",
            symbolSize:20,
            data:geoCoorMap,
            itemStyle: {
                normal: {color: '#339966' }
            },
            label: { normal:{show:false,textStyle:{color:'#eee'}}},
            animation:true,
            animationDuration:1000
        }
    }]
};

export default option;