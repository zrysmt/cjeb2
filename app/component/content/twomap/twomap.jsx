import './twomap.scss';

import React from 'react';

import Eventful from '../../../common/eventful.js';

import Map2D from '../lmap/map2D';
import InfoModal from "../infoModal/infoModal";

class Twomap extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            isInfoModalShow:false,
            info: [], //点击后的详细信息数组 for InfoModal
            clickedInfo:{}  //点击选中的点
        };
        this.handleInfoModal = this.handleInfoModal.bind(this);
    }
    componentWillReceiveProps(props){
        if(props.data&&props.data.length!=0) {
            this.setState({
                data:props.data,
                year:props.year,
                currentInd:props.currentInd,
                isInfoModalRefresh:props.isInfoModalRefresh
            },()=>{
                console.log('this.state:',this.state);
                if(this.state.isInfoModalRefresh) this.refreshInfoModal(props.data,props.currentInd,props.year);
            });
        }
    }
    refreshInfoModal(data,name,year){
        let {isInfoModalShow,clickedInfo} = this.state;
        if(!isInfoModalShow) return;
        if(__DEV__)console.log(data,name,year,clickedInfo);

        data.forEach((d,i)=>{
            if(d.cityCode == clickedInfo.cityCode){
                this.handleInfoModal(d);
            }
        })
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
            {name:[data.name],value:(data.value||"")+(data.unit||"")}
        ];
        this.setState({isInfoModalShow:true,clickedInfo:data,info:res},()=>{
            console.log('this.state',this.state);
        });
    }
    render(){
        let {data,info} = this.state;
        console.log('info info',info);
        return(
            <div>
                <Map2D
                    mapType="geoq_normalm3"
                    scale={true}
                    osmGeocoder={false}
                    maptypebar={true}
                    center={[30,110]}
                    zoom={4}
                    data = {data}
                    handleInfoModal = {this.handleInfoModal}
                >
                </Map2D>
                <div id="infomodal-div">
                    <InfoModal info={info}/>
                </div>
            </div>
        )
    }
}

export default Twomap;