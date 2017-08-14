import './twomap.scss';

import React from 'react';

import Lbasemap from '../lmap/lbasemap';
import InfoModal from "../infoModal/infoModal";

class Twomap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            info: []
        };
        this.handleInfoModal = this.handleInfoModal.bind(this);
    }
    componentWillReceiveProps(props){
        if(props.data&&props.data.length!=0) {
            this.setState({data:props.data});
        }
    }
    handleInfoModal(data){
        console.log('handleInfoModal:',data);
        let res = [
            {name:"省",value:data.province},
            {name:"城市",value:data.cityName},
            {name:"编号",value:data.cityCode},
            {name:"lat",value:data.lat},
            {name:"lng",value:data.lng},
            {name:"年份",value:data.year},
            {name:[data.name],value:data.value+data.unit}
        ];
        this.setState({info:res},()=>{
            console.log('this.state',this.state);
        });
    }
    render(){
        let {data,info} = this.state;
        console.log('info info',info);
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
                    handleInfoModal = {this.handleInfoModal}
                >
                </Lbasemap>
                <div id="infomodal-div">
                    <InfoModal info={info}/>
                </div>
            </div>
        )
    }
}

export default Twomap;