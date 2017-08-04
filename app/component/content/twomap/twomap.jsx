import React from 'react';
import axios from 'axios';

import Lbasemap from '../lmap/lbasemap';

class Twomap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentDidMount(){
        axios.get('http://localhost:8000/getjson/allcity/2014/GDP')
            .then((res)=>{
                console.log('res:',res);
                this.setState({data:res.data});
            })
    }
    render(){
        let {data} = this.state;
        return(
            <div>
                <Lbasemap
                    mapType="geoq_normalm3"
                    scale={true}
                    osmGeocoder={false}
                    maptypebar={true}
                    center={[30,110]}
                    zoom={4}
                    data = {data}
                >
                </Lbasemap>
            </div>
        )
    }
}

export default Twomap;