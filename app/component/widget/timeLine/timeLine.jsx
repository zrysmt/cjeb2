import './timeLine.scss';

import React, {Component} from 'react';
import Eventful from '../../../common/eventful.js';

class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            yearInfo:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        let year = e.target.value;
        if(__DEV__) console.log(year);
        if(!year) return;

        let yearInfoArr = this.state.yearInfo;
        yearInfoArr.forEach((data,index)=>{
            if (data.id === year){
                data.name = data.name ? '' : 'liclicked';
            }else{
                data.name = '';
            }
        })
        this.setState({
            yearInfo:yearInfoArr
        })
        Eventful.dispatch('timeLineClicked',year);
    }
    static get defaultProps() {
        return {
            year: {
                min: 1985,
                max: 2015
            }
        };
    }
    componentWillMount(){
        let {year,defaultYear} = this.props;
        let yearInfoArr = [];

        for (let i = year.min; i <= year.max; i++) {
            if((+defaultYear) === i){
                yearInfoArr.push({
                    id:i,
                    name:'liclicked'
                });
            }else{
                yearInfoArr.push({
                    id:i,
                    name:''
                });
            }
        }
        this.setState({yearInfo:yearInfoArr});
    }
    render() {
        let {yearInfo} = this.state;

        return (
            <div className="timeline-div">
                <ul className="timeline-ul" >
                    {
                        yearInfo.map((year, ind) => {
                            return (
                                <li data-year={year.id}
                                    key={year.id}
                                    value={year.id}
                                    className ={yearInfo[ind].name}
                                    onClick={this.handleClick}>
                                    {year.id}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default TimeLine;

