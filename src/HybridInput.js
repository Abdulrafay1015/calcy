import React, { useState } from 'react';

const fetchSuggestions = async (operand) => {
    const response = await fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`);
    if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
    }
    const data = await response.json();
    
    const filteredData = data.filter((item) => item.name.toLowerCase().startsWith(operand.toLowerCase()));
    return filteredData;
};

const HybridInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [result, setResult] = useState([]);
    const [inputArr, setinputArr] = useState([]);
    const operands = ['+', '-', '*', '/', '^'];

    const handleInputChange = async (event) => {
        const inputVal = event.target.value;
        setInputValue(inputVal)
        if (inputVal !=="") {
            console.log(inputArr, inputArr.length , operands.includes(event.key) , inputArr[inputArr.length -1] , event.key)
            if (inputArr.length > 0 && !operands.includes(inputArr[inputArr.length -1])) {
                fetchSuggestions(inputVal).then(res => setSuggestions(res))
            }
            else if (inputArr.length > 0 && operands.includes(event.key)) {
                setinputArr(prev => [...prev, event.target.value])
                setResult(prev => [...prev, event.target.value])
                console.log(inputArr , "condition 2")
            }
            else if (inputArr.length === 0 && inputVal) {
                fetchSuggestions(inputVal).then(res => setSuggestions(res))
            }
        } 
        else {
            setSuggestions(null);
        }
        // setInputValue(inputArr.join())
    };

    const handleSelectSuggestion = (suggestion) => {
        setinputArr(prev => [...prev,suggestion.name])
        setResult(prev =>[...prev , suggestion.value])
        setInputValue((prevValue) => prevValue + suggestion.name)
        setSuggestions(null);
        console.log(inputArr , inputArr.length , "condition 1 or 3")
    };

    return (
        <div className='container mx-auto my-36 text-center'>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type here..."
                className='p-4 rounded text-lg border border-[#caccce] w-full bg-white text-[#6A788C] focus:outline-[#caccce]'
            />
            {suggestions && (
                <ul className={`${suggestions.length === 0 ? 'h-[full]':'h-[390px]'} rounded-lg border border-[#caccce] mt-3 overflow-hidden overflow-y-auto bg-white`}>
                    {
                        suggestions.length === 0 ? 
                        <li className='border-bottom border-[#caccce] p-5 text-[#6A788C]'>
                            No suggestions found
                        </li>
                            :
                        suggestions.map((suggestion) => (
                        <li className='border-bottom border-[#caccce] p-5 hover:bg-[#ebebeb] text-[#6A788C]'  key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HybridInput;
