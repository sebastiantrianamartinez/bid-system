import React, {useEffect, useState} from "react";

import './styles/input-bid.css';

function InputBid({ handleBid, magnitude = 'M', placeholder = 'Puja' }) {
    const [value, setValue] = useState('');

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleBid(event, value);
        }
    };

    const handleInput = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="bid-input-container">
            <div className="bid-input-entry">
                <input 
                    type="number" 
                    placeholder={placeholder} 
                    onKeyPress={handleKeyPress} 
                    onChange={handleInput}
                />
                <p>{magnitude}</p>
            </div>
            <img 
                src="https://cdn.trianametria.com/media/svg/monocolor/send.svg" 
                alt="Enviar" 
                onClick={(event) => {handleBid(event, value)}} 
            />
        </div>
    );
}

export default InputBid;