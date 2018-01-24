/*
    属性:
        - time
            {
                min:1985,
                max:2015
            }
            //或者
            [1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997]
        - defaultTime = {year}
        - control = {true}
        - autoPlay = {true}
        - interval = {2000}
        - style = {{
            height:'50px'
        }}
        - 
 */

import './timeLine.scss';

import React, {Component} from 'react';
import Eventful from '../../map/common/eventful.js';

class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            timeInfo:[],
            controlImgUrl:''
        }
        this.intervalIndex = 0;
        this.handleClick = this.handleClick.bind(this);
        this.handleControlClick = this.handleControlClick.bind(this);
    }
    handleClick(e){
        let time = e.target.value;
        if(__DEV__) console.log('timeLineClicked',time);
        if(!time) return;

        let timeInfoArr = this.state.timeInfo;
        timeInfoArr.forEach((data,index)=>{
            if (data.id === time){
                data.name = data.name ? '' : 'liclicked';
            }else{
                data.name = '';
            }
        })
        this.setState({
            timeInfo:timeInfoArr
        })
        Eventful.dispatch('timeLineClicked',time);
    }
    handleControlClick(){
        let {controlImgUrl} = this.state;
        if(controlImgUrl == './imgs/play.png'){//去播放
            this.setState({controlImgUrl:'./imgs/pause.png'});
            if(this.intervalId){
                this.genInterval(this.intervalIndex);
            }
        }else if(controlImgUrl == './imgs/pause.png'){
            this.setState({controlImgUrl:'./imgs/play.png'});
            if(this.intervalId) clearInterval(this.intervalId);
        }        
    }
    static get defaultProps() {
        return {
            time: {
                min: 1985,
                max: 2015
            }
        };
    }
    componentWillMount(){
        let {time,defaultTime,interval,control,autoPlay} = this.props;
        if(control&&autoPlay){  
            this.setState({controlImgUrl:'./imgs/pause.png'});
        }else if(control&&!autoPlay){
            this.setState({controlImgUrl:'./imgs/play.png'});
        }
        this.genTimeInfoArr(defaultTime,time);
        if(control&&autoPlay){
            setTimeout(()=>{
                this.genInterval(this.intervalIndex);
            },interval || 2000)
        }       
    }
    genTimeInfoArr(defaultTime,time){
        let timeInfoArr = [];

        if(time.min && time.max){
            for (let i = time.min; i <= time.max; i++) {
                timeInfoArr.push(this.genTimeInfo(defaultTime,i));
            }            
        }else if(Arrar.isArray(time) && time.length > 0){
            time.forEach((item,index)=>{
                timeInfoArr.push(this.genTimeInfo(defaultTime,item));
            })
        }
        
        this.setState({timeInfo:timeInfoArr});        
    }
    genTimeInfo(defaultTime,time){
        let timeInfo = {};

        if((+defaultTime) === time){
            timeInfo = {
                id:time,
                name:'liclicked'
            };
        }else{
            timeInfo = {
                id:time,
                name:''
            };
        }            
        return timeInfo;
    }
    genInterval(intervalIndex){
        let {time,interval,controlImgUrl} = this.props;
        let {timeInfo} = this.state;        
        let index = this.intervalIndex;
        let intervalId = setInterval(()=>{
            if(timeInfo[index]) {
                this.genTimeInfoArr(timeInfo[index].id,time);
                Eventful.dispatch('timeLineClicked',timeInfo[index].id);
            }
            index++;
            this.intervalIndex = index;
            if(index >= timeInfo.length - 1){
                if(intervalId){
                    clearInterval(intervalId);
                    this.interval = '';
                }
            }
        },interval || 2000);  
        this.intervalId = intervalId;      
    }
    componentDidMount(){
        
    }
    componentWillUnmount(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.intervalIndex = 0;
        }
    }
    render() {
        let {timeInfo,controlImgUrl} = this.state;
        let {show,style} = this.props;
        if(!show) return '<div></div>';
        return (
            <div className="timeline-div">
                <ul className="timeline-ul" style={style}>
                    {
                        timeInfo.map((time, ind) => {
                            return (
                                <li data-time={time.id}
                                    key={time.id}
                                    value={time.id}
                                    className ={timeInfo[ind].name}
                                    onClick={this.handleClick}>
                                    {time.id}
                                </li>
                            )
                        })
                    }
                </ul>
                <div className = 'control-div'>
                    <img width='22px' height='22px' src={require(controlImgUrl)} 
                        title = {controlImgUrl == './imgs/play.png'?'暂停':'播放'}
                        onClick={this.handleControlClick}/>
                </div>
            </div>
        );
    }
}

export default TimeLine;

    