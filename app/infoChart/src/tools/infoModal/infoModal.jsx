import './infoModal.scss';

import React from 'react';

const InfoModal = ({info})=>{
    if(!info||info.length == 0){
        if(document.querySelector('.infomodal-ul')){
            document.querySelector('.infomodal-ul').innerHTML = "";
        }
        return (<ul></ul>);
    }

    return(
        <ul className="infomodal-ul">
            {
                info.map((data, index) => {
                    return (<li key={index}>
                        <div className="name-div"> {data.name} </div>
                        <div className="value-div"> {data.value} </div>
                        </li>)
                })
            }
        </ul>
    )
}


export default InfoModal;