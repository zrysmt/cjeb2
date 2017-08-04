/**
 * a webgl lib based on leaflet 
 * @Ahthor Ruyi　Zhao
 * @Date 2017-06-06
 */
// transform world coordinate by matrix uniform variable
// * mapMatrix 缩放、拖动地图的变化矩阵
// worldCoord 地理坐标（经纬度坐标要经过latLongToPixelXY处理，墨卡托投影要经过mercatorToPixels处理）
import L from 'leaflet';

let VSHADER_SOURCE =
    'attribute vec4 worldCoord;\n' +
    'uniform mat4 mapMatrix;\n' +

    'void main() {\n' +
    '  	gl_Position = mapMatrix * worldCoord;\n' +
    '  	gl_PointSize = 2.5;\n' +
    '}\n';
let FSHADER_SOURCE =
    'void main() {\n' +
    '  	gl_FragColor = vec4(1., .0, .0, 1.);\n' +
    '}\n';

var gl;
var pixelsToWebGLMatrix = new Float32Array(16);
var mapMatrix = new Float32Array(16);

var pointProgram;
var pointArrayBuffer;
var POINT_COUNT;

L.TileLayer.WebGL = L.Layer.extend({ //modify Class to Layer

    initialize: function(options) {
        // console.log(options);
        this.data = [];
        this.pointData = options.data;
        for (var i = 0; i < options.data.length; i++) {
            var latlng = latLongToPixelXY(options.data[i].x,options.data[i].y);//重要
            this.pointData[i].x = latlng.x;
            this.pointData[i].y = latlng.y;
        }
        // console.log("this.pointData:",this.pointData );
    },

    onAdd: function(map) {

        this.map = map;
        var mapsize = map.getSize();
        var options = this.options;
        var c = document.createElement("canvas");
        c.id = 'webgl-leaflet';
        c.width = mapsize.x;
        c.height = mapsize.y;

        c.style.position = 'absolute';

        map.getPanes().overlayPane.appendChild(c);

        // initialize WebGL
        gl = c.getContext('experimental-webgl');

        createShaderProgram();

        this._loadData();

        this.canvas = c;

        map.on("move", this._plot, this);

        /* hide layer on zoom, because it doesn't animate zoom */
        map.on("zoomstart", this._hide, this);
        map.on("zoomend", this._show, this);
        map.on("resize", this._resize, this);
        this._resize();
        this._plot();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this.canvas);
        map.off("move", this._plot, this);
        map.off("zoomstart", this._hide, this);
        map.off("zoomend", this._show, this);
    },

    _hide: function() {
        this.canvas.style.display = 'none';
    },

    _show: function() {
        this.canvas.style.display = 'block';
    },

    _clear: function() {},

    _resizeRequest: undefined,
    _loadData: function() {
        POINT_COUNT = this.pointData.length;
        var rawData = new Float32Array(2 * POINT_COUNT);
        for (var i = 0,m = 0; i < this.pointData.length * 2; i += 2) {
            rawData[i] = this.pointData[m].x;
            rawData[i + 1] = this.pointData[m].y;
            m++;
        }
        // console.log("rawData:",rawData);
        pointArrayBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointArrayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rawData, gl.STATIC_DRAW);

        // enable the 'worldCoord' attribute in the shader to receive buffer
        var attributeLoc = gl.getAttribLocation(pointProgram, 'worldCoord');
        gl.enableVertexAttribArray(attributeLoc);

        // tell webgl how buffer is laid out (pairs of x,y coords)
        gl.vertexAttribPointer(attributeLoc, 2, gl.FLOAT, false, 0, 0);
    },
    _plot: function() {
        var map = this.map;
        // Set clear color
        gl.clear(gl.COLOR_BUFFER_BIT);

        // copy pixel->webgl matrix
        mapMatrix.set(pixelsToWebGLMatrix);

        // Scale to current zoom (worldCoords * 2^zoom)
        var scale = Math.pow(2, map.getZoom());
        scaleMatrix(mapMatrix, scale, scale);

        //Change canvas top/left according to map bound
        //Canvas is fixed to topleft during scrolling map
        L.DomUtil.setPosition(this.canvas, map.latLngToLayerPoint(map.getBounds().getNorthWest()));

        var offset = latLongToPixelXY(map.getBounds().getNorthWest().lat, map.getBounds().getNorthWest().lng);
        //设置mapMatrix的偏移量
        // console.log("offset",offset);
        translateMatrix(mapMatrix, -offset.x, -offset.y);

        var matrixLoc = gl.getUniformLocation(pointProgram, 'mapMatrix');

        gl.uniformMatrix4fv(matrixLoc, false, mapMatrix);

        gl.drawArrays(gl.POINTS, 0, POINT_COUNT);
    },

    _resize: function() {
        //helpful for maps that change sizes
        var mapsize = this.map.getSize();
        this.canvas.width = mapsize.x;
        this.canvas.height = mapsize.y;

        var width = this.canvas.width;
        var height = this.canvas.height;

        gl.viewport(0, 0, width, height);

        // matrix which maps pixel coordinates to WebGL coordinates
        pixelsToWebGLMatrix.set([2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 0, 0, -1, 1, 0, 1
        ]);

    },


    update: function() {
        this._plot();
    }
});

L.TileLayer.webgl = function() {
    return new L.TileLayer.WebGL();
};


function createShaderProgram() {
    // create vertex shader
    var vertexSrc = VSHADER_SOURCE;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);

    // create fragment shader
    var fragmentSrc = FSHADER_SOURCE;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);

    // link shaders to create our program
    pointProgram = gl.createProgram();
    gl.attachShader(pointProgram, vertexShader);
    gl.attachShader(pointProgram, fragmentShader);
    gl.linkProgram(pointProgram);

    gl.useProgram(pointProgram);
}

function scaleMatrix(matrix, scaleX, scaleY) {
    // scaling x and y, which is just scaling first two columns of matrix
    matrix[0] *= scaleX;
    matrix[1] *= scaleX;
    matrix[2] *= scaleX;
    matrix[3] *= scaleX;

    matrix[4] *= scaleY;
    matrix[5] *= scaleY;
    matrix[6] *= scaleY;
    matrix[7] *= scaleY;
}

function translateMatrix(matrix, tx, ty) {
    // translation is in last column of matrix
    matrix[12] += matrix[0] * tx + matrix[4] * ty;
    matrix[13] += matrix[1] * tx + matrix[5] * ty;
    matrix[14] += matrix[2] * tx + matrix[6] * ty;
    matrix[15] += matrix[3] * tx + matrix[7] * ty;
}
/*web墨卡托转化*/
function mercatorToPixels(p)  {
    var EARTH_EQUATOR = 40075016.68557849,
    EARTH_RADIUS = 6378137.0,
    TILE_SIZE = 256.0
    var pixelX = (p.x + (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / TILE_SIZE);
    var pixelY = ((p.y - (EARTH_EQUATOR / 2.0)) / (EARTH_EQUATOR / -TILE_SIZE));
    return L.point(pixelX, pixelY);
}
function latLongToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0;
    var pi_4 = Math.PI * 4;
    var sinLatitude = Math.sin(latitude * pi_180);
    var pixelY = (0.5 - Math.log((1 + sinLatitude) /
        (1 - sinLatitude)) / (pi_4)) * 256;
    var pixelX = ((longitude + 180) / 360) * 256;

    var pixel = {
        x: pixelX,
        y: pixelY
    };
    return pixel;
}


export default L.TileLayer.WebGL;
