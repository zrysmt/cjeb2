import './timeLine.scss';

import React, {Component} from 'react';

class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            yearInfo:[]
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e){
        console.log(e.target.value);
        let yearInfoArr = this.state.yearInfo;
        yearInfoArr.forEach((data,index)=>{
            if (data.id === e.target.value){
                data.name = data.name ? '' : 'liclicked';
            }else{
                data.name = '';
            }
        })
        this.setState({
            yearInfo:yearInfoArr
        })
    }
    static get defaultProps() {
        return {
            year: {
                min: 1985,
                max: 2015
            },
            defaultYear:2000
        };
    }
    componentWillMount(){
        let {year,defaultYear} = this.props;
        let yearInfoArr = [];
        for (let i = year.min; i <= year.max; i++) {
            if(defaultYear === i){
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

