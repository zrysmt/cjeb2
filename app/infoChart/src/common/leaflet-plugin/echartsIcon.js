/**
 * 自定义echarts的图例
 * by zry
 * @Date 2017-05-05
 */
import './echartsIcon.scss';
import L from 'leaflet';
import echarts from 'echarts';
/**
 * echartsIcon DivIcon
 * @param  {L.map} map     leaflet地图类
 * @param  {[[],[]]} latlngs 坐标数组
 * @param  {Object} option  [配置对象]
 * 
 *   其中重要的是option.datas 传送数据，如：
 *   type为pie的时候
 *   option.datas = [
        [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
            { value: 135, name: '视频广告' },
            { value: 1548, name: '搜索引擎' }
        ],
        [
            { value: 345, name: '直接访问' },
            { value: 410, name: '邮件营销' },
            { value: 244, name: '联盟广告' },
            { value: 145, name: '视频广告' },
            { value: 548, name: '搜索引擎' }
        ],
        [
            { value: 445, name: '直接访问' },
            { value: 410, name: '邮件营销' },
            { value: 244, name: '联盟广告' },
            { value: 145, name: '视频广告' },
            { value: 148, name: '搜索引擎' }
        ],
    ];
 */
function echartsIcon(map, latlngs, option ,layerGroup) {
    var radius = 20;
    if(option.radius) radius = +(option.radius).replace('%','');
    for (var i = 0; i < latlngs.length; i++) {
        var latlng = latlngs[i];
        if(option.offset){
            latlng[0] = latlng[0] + option.offset.x;
            latlng[1] = latlng[1] + option.offset.y;
        }
        var newClassName = 'icon-' + latlng.join('-');
        var myIcon = L.divIcon({
            className: 'my-div-icon',
            html: "<div class='echarts-icon " + newClassName + "'"
                +"</div>"
        });
        // you can set .my-div-icon styles in CSS
        layerGroup.addLayer(L.marker(latlng, { icon: myIcon })).addTo(map);

        var dom = document.getElementsByClassName(newClassName)[0];
        if(option.radius){
            dom.style.width =  radius  +'px';
            dom.style.height =  radius +'px';
        }        

        var myChart = echarts.init(dom);
        option.animation = false;
        option.series[0].data = option.datas[i];
        myChart.setOption(option);
    }
    // layerGroup.addTo(map);
    return layerGroup;
}

export default echartsIcon;
