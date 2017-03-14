/**
 * 基础地图模块
 * @Date 2017-3-8
 */
import React from 'react';
import ol from 'openlayers';

import util from '../../../common/util.jsx';
import Eventful from '../../../common/Eventful.js';
import olConfig from './ol-config';

import 'openlayers/css/ol.css';
import './olbasemap.scss';

class Olbasemap extends React.Component{
    constructor(props){
        super(props);
        let map,view,projection,attribution,coor,mousePositionControl;

        attribution = new ol.Attribution({
            html: '© <a href="http://www.chinaonmap.com/map/index.html">天地图</a>'
        });
        mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(0),
            projection: 'EPSG:3857',//可以是4326 精度应该保留几个小数点
            // className: 'custom-mouse-position',
            // target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });
        this.view = view = new ol.View({
            // projection: 'EPSG:4326',//WGS84
            center: ol.proj.fromLonLat(olConfig.initialView.center||[104, 30]),
            zoom: olConfig.initialView.zoom || 5,
        });
        this.map = map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        attributions: [attribution],
                        url: "http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
                    })
                }),
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: "http://t2.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}"
                    })
                })
            ],
            view: view,
            controls: ol.control.defaults().extend([
                new ol.control.FullScreen(), //全屏控件
                new ol.control.ScaleLine(), //比例尺
                new ol.control.OverviewMap(), //鹰眼控件
                new ol.control.Rotate(),
                new ol.control.ZoomSlider(),
                mousePositionControl
             ]),
        });

        Eventful.subscribe('zoomtoall',()=>this.handleClickOfZoomtoall());//订阅
        Eventful.subscribe('distance',()=>this.handleClickOfDistance());
        Eventful.subscribe('area',()=>this.handleClickOfArea());
    }
    handleClickOfZoomtoall(){
        this.view.animate({zoom:olConfig.initialView.zoom || 5,
            center:ol.proj.fromLonLat(olConfig.initialView.center||[104, 30])});
    }
    handleClickOfDistance(){
        this.map.removeInteraction(this.draw);
        this._handleClickOfDistanceArea('LineString',true);
        
    }
    handleClickOfArea(){
        this.map.removeInteraction(this.draw);
        this._handleClickOfDistanceArea('Polygon',true);
    }
    /**
     * [_handleClickOfDistanceArea description]
     * @param  {[type]}  type       [description]
     * @param  {Boolean} isGeodesic [是否精细计算,默认是]
     * @return {[type]}             [description]
     */
    _handleClickOfDistanceArea(type,isGeodesic=true){
        let wgs84Sphere,pointerMoveHandler,sketch,helpTooltipElement,draw,source,vector,
        formatLength,formatArea;

        wgs84Sphere = new ol.Sphere(6378137);

        source =  new ol.source.Vector();
        vector = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
              }),
              stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                  color: '#ffcc33'
                })
              })
            })
        });
        this.map.addLayer(vector);

        pointerMoveHandler = (evt)=>{
            if(evt.dragging) return;
            let helpMsg = 'Click to start drawing';
            if(sketch){
                let geom = (sketch.getGeometry());
                if(geom instanceof ol.geom.Polygon){
                    helpMsg = "Click to continue drawing the polygon";
                }else if(geom instanceof ol.geom.LineString){
                    helpMsg = "Click to continue drawing the line";
                }
            }
            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            helpTooltipElement.classList.remove('hidden');
        }

        this.map.on('pointermove',pointerMoveHandler);
        this.map.getViewport().addEventListener('mouseout', function() {
            helpTooltipElement.classList.add('hidden');
        });
        formatLength = function(line) {
            let length;
            if (isGeodesic) {
              let coordinates = line.getCoordinates();
              length = 0;
              let sourceProj = map.getView().getProjection();
              for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                let c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                let c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                length += wgs84Sphere.haversineDistance(c1, c2);
              }
            } else {
              length = Math.round(line.getLength() * 100) / 100;
            }
            let output;
            if (length > 100) {
              output = (Math.round(length / 1000 * 100) / 100) +
                  ' ' + 'km';
            } else {
              output = (Math.round(length * 100) / 100) +
                  ' ' + 'm';
            }
            return output;
        };


      /**
       * Format area output.
       * @param {ol.geom.Polygon} polygon The polygon.
       * @return {string} Formatted area.
       */
        formatArea = function(polygon) {
            let area;
            if (isGeodesic) {
              let sourceProj = map.getView().getProjection();
              let geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                  sourceProj, 'EPSG:4326'));
              let coordinates = geom.getLinearRing(0).getCoordinates();
              area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
            } else {
              area = polygon.getArea();
            }
            let output;
            if (area > 10000) {
              output = (Math.round(area / 1000000 * 100) / 100) +
                  ' ' + 'km<sup>2</sup>';
            } else {
              output = (Math.round(area * 100) / 100) +
                  ' ' + 'm<sup>2</sup>';
            }
            return output;
       };
       addInteraction();
       
        function addInteraction(){
            draw = new ol.interaction.Draw({
                source: source,
                type: /** @type {ol.geom.GeometryType} */ (type),
                style: new ol.style.Style({
                  fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                  }),
                  stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2
                  }),
                  image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                      color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                      color: 'rgba(255, 255, 255, 0.2)'
                    })
                  })
                })
            });
            this.draw = draw;
            this.map.addInteraction(draw);
            createMeasureTooltip();
            createHelpTooltip();

            let listener;
            draw.on('drawstart', function(evt) {
                  // set sketch
                  sketch = evt.feature;

                  /** @type {ol.Coordinate|undefined} */
                  let tooltipCoord = evt.coordinate;

                  listener = sketch.getGeometry().on('change', function(evt) {
                    let geom = evt.target;
                    let output;
                    if (geom instanceof ol.geom.Polygon) {
                      output = formatArea(geom);
                      tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof ol.geom.LineString) {
                      output = formatLength(geom);
                      tooltipCoord = geom.getLastCoordinate();
                    }
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                  });
                }, this);

            draw.on('drawend',function() {
                  measureTooltipElement.className = 'tooltip tooltip-static';
                  measureTooltip.setOffset([0, -7]);
                  // unset sketch
                  sketch = null;
                  // unset tooltip so that a new one can be created
                  measureTooltipElement = null;
                  createMeasureTooltip();
                  ol.Observable.unByKey(listener);
                }, this);
            


            }
              /**
       * Creates a new help tooltip
       */
      function createHelpTooltip() {
        if (helpTooltipElement) {
          helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
          element: helpTooltipElement,
          offset: [15, 0],
          positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
      }


      /**
       * Creates a new measure tooltip
       */
      function createMeasureTooltip() {
        if (measureTooltipElement) {
          measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'tooltip tooltip-measure';
        measureTooltip = new ol.Overlay({
          element: measureTooltipElement,
          offset: [0, -15],
          positioning: 'bottom-center'
        });
        map.addOverlay(measureTooltip);
      }
    }
	componentDidMount(){
		util.adaptHeight('map',105,300);//高度自适应

        if(__DEV__) console.info("componentDidMount");

		this.map.setTarget(this.refs.map);
    }
    componentWillUnmount () {
        this.map.setTarget(undefined)
    }

    render(){
		return(
			<div id="map" ref="map" >
            </div>
		)
	}
}

export default Olbasemap;