import React, { useState } from 'react';
import axios from 'axios';
import { BsCamera, BsUpload } from 'react-icons/bs';
import Single_product from '../Product/Single_product';
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';

const VisualSearchPage = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const alert = useAlert();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            handleSearch(file);
        }
    };

    const handleSearch = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await axios.post('/api/v1/visual-search', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                setResults(data.products);
                setKeywords(data.extractedKeywords);
            }
        } catch (error) {
            alert.error(error.response?.data?.message || 'Failed to perform visual search');
            setResults([]);
            setKeywords([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[70vh] bg-gray-50 py-10 px-4'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-center mb-10'>
                    <h1 className='text-3xl font1 font-bold text-gray-800 mb-4'>AI Visual Search</h1>
                    <p className='text-gray-600 font1 mb-8'>Upload a photo of any clothing item, and our AI will find similar products in our store!</p>
                    
                    <label className='cursor-pointer inline-flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-[#ff3f6c] rounded-xl bg-white hover:bg-pink-50 transition-colors duration-300'>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className='w-full h-full object-cover rounded-xl p-1' />
                        ) : (
                            <>
                                <BsUpload className='text-4xl text-[#ff3f6c] mb-4' />
                                <span className='font1 font-bold text-gray-700'>Click to Upload Image</span>
                                <span className='text-xs text-gray-500 mt-2'>Supports JPG, PNG</span>
                            </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center mt-10'>
                        <div className="w-16 h-16 border-4 border-[#ff3f6c] border-t-transparent rounded-full animate-spin"></div>
                        <p className='mt-4 font1 text-gray-600 animate-pulse'>Gemini AI is analyzing your image...</p>
                    </div>
                ) : (
                    results.length > 0 && (
                        <div className='mt-10'>
                            <div className='mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                                <h2 className='font1 font-bold text-gray-800 mb-2'>AI Detected Features:</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {keywords.map((kw, i) => (
                                        <span key={i} className='bg-pink-100 text-[#ff3f6c] px-3 py-1 rounded-full text-sm font1 font-medium capitalize border border-pink-200'>
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <h2 className='text-2xl font1 font-bold text-gray-800 mb-6'>Similar Products Found</h2>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                                {results.map((product) => (
                                    <Single_product key={product._id} pro={product} />
                                ))}
                            </div>
                        </div>
                    )
                )}

                {!loading && imagePreview && results.length === 0 && (
                    <div className='text-center mt-10 p-8 bg-white rounded-lg shadow-sm'>
                        <p className='text-xl font1 text-gray-600'>We couldn't find exact matches for this item right now.</p>
                        <p className='text-gray-500 mt-2'>Try uploading a different angle or a clearer image.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualSearchPage;
