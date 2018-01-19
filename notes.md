## Turf.js
Turf.js中的几何数据组织规范以WKT格式为标准

## turf-isolines matrix

turf-isolines (like turf-isobands) expects a pointGrid as input, which will be internally converter into a matrix (Array<Array<number>>) of zProperty values to be able to calculate the isolines. With just random points there is no matrix (that's why a @turf/interpolate module has been desirable for long time).
If you have though a matrix and you want to convert it into a pointGrid you could use matrix-to-grid.

I'm surprised (and sorry) the documentation have not been correctly updated when the module was re-implemented, I'll commit the appropriate correction.

> https://github.com/Turfjs/turf/issues/829