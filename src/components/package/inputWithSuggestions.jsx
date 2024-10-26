import React, { useEffect, useState } from 'react';

import './styles/input-suggestions.css';

function InputWithSuggestions({ handler, suggestions, placeholder = 'Paleta' }) {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if(value.length < 1){
            setFilteredSuggestions([]);
            return;
        }
        else{
            setFilteredSuggestions(
                suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setFilteredSuggestions([]);
    };

    useEffect(() => {
        handler(inputValue);
    }, [inputValue]);

    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 100); // Delay to allow click event on suggestion
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <div className='pallete-container input-suggestions-container'>
            <input 
                type="text" 
                value={inputValue} 
                onChange={handleChange} 
                placeholder={placeholder}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />
            {isFocused && filteredSuggestions.length > 0 && (
                <ul className="suggestions-list">
                    {filteredSuggestions.slice(0, 3).map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="suggestion-item">
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InputWithSuggestions;