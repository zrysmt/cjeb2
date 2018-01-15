/**
 * This class is an example of a custom DataSource.  It loads JSON data as
 * defined by Google's WebGL Globe, https://github.com/dataarts/webgl-globe.
 * @alias WebGLGlobeDataSource
 * @constructor
 *
 * @param {String} [name] The name of this data source.  If undefined, a name
 *                        will be derived from the url.
 *
 * @example
 * var dataSource = new Cesium.WebGLGlobeDataSource();
 * dataSource.loadUrl('sample.json');
 * viewer.dataSources.add(dataSource);
 */
import Cesium from 'cesium/Cesium';

function WebGLGlobeDataSource(name) {
    //All public configuration is defined as ES5 properties
    //These are just the "private" variables and their defaults.
    this._name = name;
    this._changed = new Cesium.Event();
    this._error = new Cesium.Event();
    this._isLoading = false;
    this._loading = new Cesium.Event();
    this._entityCollection = new Cesium.EntityCollection();
    this._seriesNames = [];
    this._seriesToDisplay = undefined;
    this._heightScale = 1000;
    this._entityCluster = new Cesium.EntityCluster();
}

Object.defineProperties(WebGLGlobeDataSource.prototype, {
    //The below properties must be implemented by all DataSource instances

    /**
     * Gets a human-readable name for this instance.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {String}
     */
    name : {
        get : function() {
            return this._name;
        }
    },
    /**
     * Since WebGL Globe JSON is not time-dynamic, this property is always undefined.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {DataSourceClock}
     */
    clock : {
        value : undefined,
        writable : false
    },
    /**
     * Gets the collection of Entity instances.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {EntityCollection}
     */
    entities : {
        get : function() {
            return this._entityCollection;
        }
    },
    /**
     * Gets a value indicating if the data source is currently loading data.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Boolean}
     */
    isLoading : {
        get : function() {
            return this._isLoading;
        }
    },
    /**
     * Gets an event that will be raised when the underlying data changes.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Event}
     */
    changedEvent : {
        get : function() {
            return this._changed;
        }
    },
    /**
     * Gets an event that will be raised if an error is encountered during
     * processing.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Event}
     */
    errorEvent : {
        get : function() {
            return this._error;
        }
    },
    /**
     * Gets an event that will be raised when the data source either starts or
     * stops loading.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Event}
     */
    loadingEvent : {
        get : function() {
            return this._loading;
        }
    },

    //These properties are specific to this DataSource.

    /**
     * Gets the array of series names.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {String[]}
     */
    seriesNames : {
        get : function() {
            return this._seriesNames;
        }
    },
    /**
     * Gets or sets the name of the series to display.  WebGL JSON is designed
     * so that only one series is viewed at a time.  Valid values are defined
     * in the seriesNames property.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {String}
     */
    seriesToDisplay : {
        get : function() {
            return this._seriesToDisplay;
        },
        set : function(value) {
            this._seriesToDisplay = value;

            //Iterate over all entities and set their show property
            //to true only if they are part of the current series.
            var collection = this._entityCollection;
            var entities = collection.values;
            collection.suspendEvents();
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                entity.show = value === entity.seriesName;
            }
            collection.resumeEvents();
        }
    },
    /**
     * Gets or sets the scale factor applied to the height of each line.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Number}
     */
    heightScale : {
        get : function() {
            return this._heightScale;
        },
        set : function(value) {
            if (value < 0) {
                throw new Cesium.DeveloperError('value must be greater than 0');
            }
            this._heightScale = value;
        }
    },
    /**
     * Gets whether or not this data source should be displayed.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {Boolean}
     */
    show : {
        get : function() {
            return this._entityCollection;
        },
        set : function(value) {
            this._entityCollection = value;
        }
    },
    /**
     * Gets or sets the clustering options for this data source. This object can be shared between multiple data sources.
     * @memberof WebGLGlobeDataSource.prototype
     * @type {EntityCluster}
     */
    clustering : {
        get : function() {
            return this._entityCluster;
        },
        set : function(value) {
            if (!Cesium.defined(value)) {
                throw new Cesium.DeveloperError('value must be defined.');
            }
            this._entityCluster = value;
        }
    }
});

/**
 * Asynchronously loads the GeoJSON at the provided url, replacing any existing data.
 * @param {Object} url The url to be processed.
 * @returns {Promise} a promise that will resolve when the GeoJSON is loaded.
 */
WebGLGlobeDataSource.prototype.loadUrl = function(url,dataName,option) {
    if (!Cesium.defined(url)) {
        throw new Cesium.DeveloperError('url is required.');
    }
    //Create a name based on the url
    var name = Cesium.getFilenameFromUri(url);

    //Set the name if it is different than the current name.
    if (this._name !== name) {
        this._name = name;
        this._changed.raiseEvent(this);
    }

    //Use 'when' to load the URL into a json object
    //and then process is with the `load` function.
    var that = this;
    if(option){
        var heightScale = option.heightScale ? option.heightScale : 1;
        var size = option.size ? option.size : 3;
        if(option.heightScale) that.heightScale = size * 200 * heightScale;
        this.option = option;
        this.option.heightScale = this.heightScale;
        this.option.size = size * 200;
    }
    if(__DEV__) console.log('option',option);
    return Cesium.when(Cesium.loadJson(url), function(json) {
        console.log('json',json);
        if(!option.classifyTypes){  //单个
            //deal data
            var res = [];
            var res1 = [],res2 = [];
            for (var i = 0; i < json.length; i++) {
                let lat = +json[i].lat,
                    lng = +json[i].lng,
                    value = +json[i].value;
                if(lat && lng && value){
                    res1.push(lat, lng, value);
                }
            }
            res2.push(dataName,res1);
            res.push(res2);
            // end            
            that.load(res);
        }else{
            var res = [];
            for (var i = 0; i < option.classifyTypes.length; i++) {
                var res1 = [],res2 = [];
                for (var key in json) {
                    let lat = +(json[key][i].lat)+ i * 0.1,
                        lng = +(json[key][i].lng)+ i * 0.1,
                        value = +(json[key][i].value);
                    if(lat && lng && value){
                        res1.push(lat, lng, value);
                    }
                }
                res2.push(dataName,res1);
                res.push(res2);       
            }
            if(__DEV__) console.log('=',res);
            that.load(res);  
                     
        }
        // return that.load(res, url);
         
    }).otherwise(function(error) {
        //Otherwise will catch any errors or exceptions that occur
        //during the promise processing. When this happens,
        //we raise the error event and reject the promise.
        this._setLoading(false);
        that._error.raiseEvent(that, error);
        return Cesium.when.reject(error);
    });
};

/**
 * Loads the provided data, replacing any existing data.
 * @param {Object} data The object to be processed.
 */
WebGLGlobeDataSource.prototype.load = function(data) {
    //>>includeStart('debug', pragmas.debug);
    if (!Cesium.defined(data)) {
        throw new Cesium.DeveloperError('data is required.');
    }
    //>>includeEnd('debug');

    //Clear out any data that might already exist.
    this._setLoading(true);
    this._seriesNames.length = 0;
    this._seriesToDisplay = undefined;

    var heightScale = this.heightScale;
    var entities = this._entityCollection;
   
    //It's a good idea to suspend events when making changes to a
    //large amount of entities.  This will cause events to be batched up
    //into the minimal amount of function calls and all take place at the
    //end of processing (when resumeEvents is called).
    entities.suspendEvents();
    entities.removeAll();

    //WebGL Globe JSON is an array of series, where each series itself is an
    //array of two items, the first containing the series name and the second
    //being an array of repeating latitude, longitude, height values.
    //
    //Here's a more visual example.
    //[["series1",[latitude, longitude, height, ... ]
    // ["series2",[latitude, longitude, height, ... ]]
    // 
    // Loop over each series
    for (var x = 0; x < data.length; x++) {
        var series = data[x];
        var seriesName = series[0];
        var coordinates = series[1];

        //Add the name of the series to our list of possible values.
        this._seriesNames.push(seriesName);

        //Make the first series the visible one by default
        var show = x === 0;
        if (show) {
            this._seriesToDisplay = seriesName;
        }

        var classifyColor = this.option.classifyTypes?this.option.classifyTypes[x]:'';
        //Now loop over each coordinate in the series and create
        // our entities from the data.
        for (var i = 0; i < coordinates.length; i += 3) {
            var latitude = coordinates[i];
            var longitude = coordinates[i + 1];
            var height = coordinates[i + 2];

            //Ignore lines of zero height.
            if(height === 0) {
                continue;
            }

            var color = Cesium.Color.fromHsl((0.6 - (height * 0.5)), 1.0, 0.5);
            var surfacePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
            var heightPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height * heightScale);

            var entity = genEntity(this.option,classifyColor,surfacePosition,heightPosition,height,i,seriesName,show);
            //Add the entity to the collection.
            entities.add(entity);
        }
    }

    //Once all data is processed, call resumeEvents and raise the changed event.
    entities.resumeEvents();
    this._changed.raiseEvent(this);
    this._setLoading(false);
};

WebGLGlobeDataSource.prototype._setLoading = function(isLoading) {
    if (this._isLoading !== isLoading) {
        this._isLoading = isLoading;
        this._loading.raiseEvent(this, isLoading);
    }
};

function genEntity(option,classifyColor,surfacePosition,heightPosition,height,index,seriesName,show){
    if(!option.type) option.type = 'line';
    var entity = null,
       material = null,outlineColor = null,
       heightScale = option.heightScale,
       size = option.size;
    if(classifyColor){
        material = Cesium.Color.fromCssColorString(classifyColor);
    }else if(option.color) {
        material = Cesium.Color.fromCssColorString(option.color);
    }else{
        material = Cesium.Color.fromCssColorString('#67ADDF');
    }
    if(option.outlineColor) outlineColor = Cesium.Color.fromCssColorString(option.outlineColor);
    switch(option.type) {
        case 'line':
            //WebGL Globe only contains lines, so that's the only graphics we create.
            var polyline = new Cesium.PolylineGraphics();
            // polyline.material = new Cesium.ColorMaterialProperty(color); //remove color
            polyline.material = material;
            polyline.width = new Cesium.ConstantProperty(2);
            polyline.followSurface = new Cesium.ConstantProperty(false);
            polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);

            //The polyline instance itself needs to be on an entity.
            entity = new Cesium.Entity({
                id : seriesName + ' index ' + index.toString(),
                show : show,
                polyline : polyline,
                seriesName : seriesName //Custom property to indicate series name
            });       
    

            break;
        case 'bar':
            //The boxGraphics instance itself needs to be on an entity.
            entity = {
                name : 'box',
                position: surfacePosition,
                box : {
                    dimensions : new Cesium.Cartesian3(size*30, size*30, height * heightScale),
                    material : material,
                    fill:option.fill||true,
                    outline:option.outline||false,
                    outlineColor:outlineColor||''
                }
            };              
            break;
        case 'cylinder':
            entity = {
                name : 'cylinder',
                position: surfacePosition,
                cylinder : {
                    length :  height * heightScale,
                    topRadius : size*15,
                    bottomRadius : size*15,
                    material : material,
                    outline : option.outline||false,
                    outlineColor : outlineColor
                }
            }
    }

    return entity;
}
export default WebGLGlobeDataSource;
