/**
 * this.state.data的格式形式
 * [
 *     {name:"",subname:["","",""]},
 *     {name:"",subname:["","",""]}
 * ]
 */
import './selectPane.scss';

import React,{Component} from 'react';
import Eventful from '../../../common/eventful.js';

class SelectPane extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[],
            defaultActive:''
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillReceiveProps(props){
        if(props.data && props.data.length > 0)
            this.setState({data:props.data,defaultActive:props.defaultActive},()=>{
            })
    }
    handleClick(e){
        let clickedName = e.target.getAttribute('name');
        if(__DEV__) console.log(clickedName);
        if(clickedName){
            this.setState({defaultActive:clickedName});
            Eventful.dispatch('selectPaneClicked',clickedName);
        }
    }
    render(){
        let {data,defaultActive} = this.state;
        return(
            <div className="select-pane">
                <ul>
                    {
                        data.map((d,i)=>{
                            return (
                                <li key={"li"+i}>
                                    <div className="subname">【{d.name}】</div>
                                    <div className="subdata">
                                    {
                                        d.subname.map((subData,subIndex)=>{
                                            let className = (subData === defaultActive)?"ind-active":"";
                                            return (
                                                <span key={subIndex}
                                                      className={className}
                                                      name={subData}
                                                      onClick={this.handleClick}
                                                >
                                                {subData}</span>);

                                        })
                                    }
                                    </div>

                                </li>
                            );

                        })
                    }
                </ul>
            </div>
        );
    }
}

export default SelectPane;