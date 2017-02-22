import gConfig from '../../common/gConfig';
let gTColor = new gConfig().getSiteObj().gTColor;//主题色
let option = {
    backgroundColor: '#317ab7',
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
    series: [{
        name: '长江经济带',
        type: 'map',
        roam: true,
        center: [112, 28],
        zoom: 3,
        mapType: 'china',
        tooltip: {
            trigger: 'item',
        },
        itemStyle: {
            normal: {
                borderColor: 'rgba(100,149,237,1)',
                borderWidth: 0.5,
                areaStyle: {
                    color: '#9ec7f3'
                },
                label: { show: false, textStyle: { color: '#439f55', fontSize: 12, fontFamily: 'Microsoft YaHei' } }
            },
            emphasis: {
                areaStyle: {
                    color: '#feda9d'
                },
                label: { show: true, textStyle: { color: '#439f55', fontSize: 12, fontFamily: 'Microsoft YaHei' } }
            }
        },
        data: [
            { name: '江苏', value: 1, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '浙江', value: 2, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '安徽', value: 3, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '江西', value: 4, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '湖北', value: 5, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '湖南', value: 6, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '四川', value: 7, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '云南', value: 8, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '贵州', value: 9, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '上海', value: 10, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
            { name: '重庆', value: 11, itemStyle: { normal: { areaColor: gTColor } }, label: { normal: { show: true, textStyle: { color: '#337ab7' } }, emphasis: { show: true, textStyle: { color: '#439f55' } } } },
        ],
    }]
};

export default option;