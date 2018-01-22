/**
 * 自定义echarts的图例
 * by zry
 * @Date 2017-05-05
 */
import './leafletLegend.css';

import L from 'leaflet';
function leafletLegend(map,options){
    L.Control.leafletLegend(options).addTo(map);
}
L.Control.LeafletLegend = L.Control.extend({
    statics: {
        TITLE: '图例'
    },
    options: {
        position: 'bottomright',
    },
    initialize: function(options) {
        L.Control.prototype.initialize.call(this, options);

    },
    onAdd: function(map) {
        var className = 'leaflet-control';
        this._container = L.DomUtil.create('div', 'leaflet-bar');
        var link = L.DomUtil.create('div', className + '-legend', this._container);
        // link.href = '#';
        var html = "<div class='legend-div'>";      
        var colorHtml = '',labelHtml = '';
        for (var i = 0; i < this.options.color.length; i++) {
            var color = this.options.color[i],
                label = this.options.label[i];
            colorHtml +=  "<span style='background:"+color+";'></span>"
            labelHtml +=  "<label>>"+label+" </label>"
        };
        html = html 
            + "<div>"
                    + colorHtml 
            + "</div><div class='legend-div-label'>"
                    +labelHtml
                + "</div>";
            + "</div>";  

        link.innerHTML = html;           
        link.title = L.Control.LeafletLegend.TITLE;

        return this._container;
    },
    toggle: function() {
        if (this.handler.enabled()) {
            this.handler.disable.call(this.handler);
        } else {
            this.handler.enable.call(this.handler);
        }
    },
});



L.Control.leafletLegend = function(options) {
    return new L.Control.LeafletLegend(options);
};


export default leafletLegend ;
