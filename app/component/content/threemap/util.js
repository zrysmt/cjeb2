/**
 * 三维地球组件的工具
 */
let threeConfig = {
    /**
     * lngLat2Coordinate 经纬度转为屏幕坐标(Three.js屏幕坐标)
     * @param  {Number}    lat 经度
     * @param  {Number}    lng 纬度
     * @param  {Number}    radius 半径
     * @return {Object}    屏幕坐标对象 x y z
     */
    lngLat2Coordinate: (lat,lng, radius) => {
        var lngLat = { lng: lng, lat: lat };
        var l = radius * Math.cos(lngLat.lat / 180 * Math.PI);

        var x = l * Math.sin(lngLat.lng / 180 * Math.PI);
        var y = radius * Math.sin(lngLat.lat / 180 * Math.PI);
        var z = l * Math.cos(lngLat.lng / 180 * Math.PI);

        return { x: x, y: y, z: z };
    },
    /**
     * lngLat2PixelXY 二维平面，经纬度转化为WebGL屏幕坐标
     * @param  {Number}      lng 纬度
     * @param  {Number}      lat 经度
     * @return {[Object]}    WebGL屏幕坐标
     */
    lngLat2PixelXY: (lat, lng) => {
        var pi_180 = Math.PI / 180.0;
        var pi_4 = Math.PI * 4;
        var sinLatitude = Math.sin(lat * pi_180);
        var pixelY = (0.5 - Math.log((1 + sinLatitude) /
            (1 - sinLatitude)) / (pi_4)) * 256;
        var pixelX = ((lng + 180) / 360) * 256;

        var pixel = {
            x: pixelX,
            y: pixelY
        };
        return pixel;
    },
    /**
     * coordinate2LngLat 屏幕坐标转为经纬度坐标
     * @param  {Number} x x坐标
     * @param  {Number} y y坐标
     * @param  {Number} z z坐标
     * @return {Object}   经纬度坐标
     */
    coordinate2LngLat: (x, y, z) => {
        var lng = Math.atan(parseFloat(x) / parseFloat(z));

        if (z <= 0 && x >= 0) {
            lng = lng / Math.PI * 180 + 180;
        } else if (z < 0 && x < 0) {
            lng = lng / Math.PI * 180 - 180;
        } else {
            lng = lng / Math.PI * 180;
        }

        var lat = Math.atan(parseFloat(y) / Math.sqrt(Math.pow(parseFloat(x), 2) + Math.pow(parseFloat(z), 2))) / Math.PI * 180;
        return { lng: lng, lat: lat };
    }
}