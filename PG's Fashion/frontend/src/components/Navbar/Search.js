import React, { Fragment, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import { BsMic, BsMicFill } from 'react-icons/bs'
import {Allproduct} from '../../action/productaction'
import {useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom'

const Search = () => {
    
    const [state, setstate] = useState("")
    const [isListening, setIsListening] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate ()

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Search");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setstate(transcript);
            navigate(`/products?keyword=${transcript}`);
            dispatch(Allproduct());
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    }

    function searchenter(e) {
        e.preventDefault();
        if (state.trim()) {
            navigate(`/products?keyword=${state}`)
            dispatch(Allproduct())
        } else {
            navigate('/products')
        }
     
    }
    return (
        <Fragment>
            <form className=" self-center mt-[5%] " onSubmit={searchenter}>
            <span className='search_div h-full  justify-center items-center lg:w-72 relative'>
                <button className='searchbtn' type="submit"><FiSearch  /></button>
            <input type="text" placeholder='Search for products, brands and more' 
            className=' search caret-[#ff2459]' value={state} onChange={(e)=>setstate(e.target.value)}/>
                <button type="button" onClick={startListening} title="Search by Voice" className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-[#ff2459]' : 'text-gray-500'} hover:text-[#ff3f6c] transition-colors`}>
                    {isListening ? <BsMicFill /> : <BsMic />}
                </button>
            </span>
            </form>
           
         
            
        </Fragment>
    )
}

export default Search