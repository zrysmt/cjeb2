import React from 'react';

import Lbasemap from '../lmap/lbasemap';

class Twomap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
    }
    componentWillReceiveProps(props){
        if(props.data&&props.data.length!=0) {
            this.setState({data:props.data});
        }
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