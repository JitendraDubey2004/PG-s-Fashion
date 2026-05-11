import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Single_product from '../Product/Single_product';

const OutfitSuggestions = ({ productId }) => {
    const [outfit, setOutfit] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutfit = async () => {
            try {
                const { data } = await axios.get(`/api/v1/stylist/outfit/${productId}`);
                if (data.success) {
                    setOutfit(data.outfit);
                }
            } catch (error) {
                console.error("Failed to fetch outfit suggestions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOutfit();
    }, [productId]);

    if (loading) return null;
    if (outfit.length === 0) return null;

    return (
        <div className='mt-10 border-t pt-6'>
            <div className='flex items-center gap-2 mb-6'>
                <h1 className='text-2xl font1 font-bold text-slate-800'>Complete The Look</h1>
                <span className='bg-pink-100 text-[#ff3f6c] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider'>AI Styled</span>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100'>
                {outfit.map((product) => (
                    <div key={product._id} className='bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                        <Single_product pro={product} />
                    </div>
                ))}
                
                <div className='hidden md:flex col-span-2 items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-lg'>
                    <div>
                        <p className='font1 font-bold text-slate-400 text-lg'>Our AI Stylist thinks <br/> these match perfectly!</p>
                        <p className='text-xs text-slate-400 mt-2 italic'>Recommendations based on color, style, and category.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutfitSuggestions;
