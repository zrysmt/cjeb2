import React from 'react';
import axios from 'axios';

import Lbasemap from '../lmap/lbasemap';
import WebGLTileLayer from '../../../common/Leaflet.WebGL/src/L.WebGL.js';

class Twomap extends React.Component{
    componentDidMount(){
        axios.get('http://localhost:8000/getjson/allcity/2014/GDP')
            .then((res)=>{
                console.log('res:',res);
            })
    }
    render(){
        return(
            <div>
                <Lbasemap
                    mapType="geoq_normalm3"
                    scale={true}
                    osmGeocoder={false}
                    maptypebar={true}
                    center={[30,110]}
                    zoom={4}
                >
                </Lbasemap>
            </div>
        )
    }
}

export default Twomap;