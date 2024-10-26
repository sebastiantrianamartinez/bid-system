import React from "react";

import './styles/keyboard-suggestions.css';

function KeyboardSuggestions({ callback, mathBid, suggestions }) {

    const handleKeyClick = (event, suggestion) => {
        const newBid = parseFloat(mathBid) + parseFloat(suggestion);
        callback(event, newBid);
    }

    return (
        <div className='keyboard-suggestions-container'>
            <div className="keyboard">
                {suggestions.map((suggestion, index) => (
                    <div 
                        key={index}
                        onClick={(event) => {handleKeyClick(event, suggestion)}}
                    
                    >
                        {`+${suggestion}M`}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KeyboardSuggestions;