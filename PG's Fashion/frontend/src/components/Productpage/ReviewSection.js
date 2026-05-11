import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newReview } from '../../action/productaction';
import { NEW_REVIEW_RESET } from '../../const/productconst';
import { useAlert } from 'react-alert';

const ReviewSection = ({ productId, reviews }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [sentiment, setSentiment] = useState(null);
    const [loadingSentiment, setLoadingSentiment] = useState(false);

    const { success, error } = useSelector((state) => state.newReview);
    const { isAuthentication, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            alert.error(error);
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
            setRating(0);
            setComment('');
        }
    }, [dispatch, alert, error, success]);

    useEffect(() => {
        const fetchSentiment = async () => {
            if (reviews && reviews.length > 0) {
                setLoadingSentiment(true);
                try {
                    const res = await fetch(`/api/v1/products/${productId}/sentiment`);
                    const data = await res.json();
                    if (data.success && data.sentiment) {
                        setSentiment(data.sentiment);
                    }
                } catch (err) {
                    console.error("Failed to fetch sentiment", err);
                }
                setLoadingSentiment(false);
            }
        };
        fetchSentiment();
    }, [productId, reviews]);

    const reviewSubmitHandler = () => {
        if (!isAuthentication) {
            alert.info("Please login to submit a review");
            return;
        }

        const reviewData = {
            rating,
            comment,
            productId,
            name: user.name
        };

        dispatch(newReview(reviewData));
    };

    return (
        <div className='mt-10 border-t pt-6'>
            <h1 className='text-2xl font1 font-bold text-slate-800 mb-6'>Customer Reviews</h1>
            
            {loadingSentiment ? (
                <div className='mb-8 p-4 bg-blue-50 border border-blue-100 rounded-md'>
                     <p className='text-sm text-blue-600 animate-pulse font1'>✨ Analyzing reviews with AI...</p>
                </div>
            ) : sentiment && sentiment.summary && sentiment.summary !== "Not enough reviews to analyze sentiment." ? (
                <div className='mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-md'>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='text-xl'>✨</span>
                        <h3 className='text-md font1 font-bold text-indigo-900'>AI Review Summary</h3>
                    </div>
                    <p className='text-sm text-indigo-800 mb-4 font1'>{sentiment.summary}</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {sentiment.pros && sentiment.pros.length > 0 && (
                            <div>
                                <h4 className='text-xs font1 font-bold text-green-700 mb-1'>Pros</h4>
                                <ul className='list-disc pl-4 text-xs font1 text-green-800'>
                                    {sentiment.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                </ul>
                            </div>
                        )}
                        {sentiment.cons && sentiment.cons.length > 0 && (
                            <div>
                                <h4 className='text-xs font1 font-bold text-red-700 mb-1'>Cons</h4>
                                <ul className='list-disc pl-4 text-xs font1 text-red-800'>
                                    {sentiment.cons.map((con, i) => <li key={i}>{con}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            <div className='mb-8 bg-gray-50 p-6 rounded-md'>
                <h2 className='text-lg font1 font-semibold mb-4'>Write a Review</h2>
                <div className='flex gap-2 mb-4'>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span 
                            key={num} 
                            onClick={() => setRating(num)}
                            className={`cursor-pointer text-2xl ${rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full border rounded p-2 text-sm font1 outline-none focus:border-[#ff3f6c]'
                    rows="3" 
                    placeholder="Share your thoughts about this product..."
                />
                <button 
                    onClick={reviewSubmitHandler}
                    disabled={!rating || !comment.trim()}
                    className='mt-4 bg-[#ff3f6c] text-white px-6 py-2 rounded font1 font-bold disabled:opacity-50'
                >
                    Submit Review
                </button>
            </div>

            <div className='flex flex-col gap-4'>
                {reviews && reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev._id} className='border-b pb-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <div className='w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600'>
                                    {rev.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className='font-semibold text-sm font1'>{rev.name}</p>
                                    <div className='text-yellow-400 text-xs'>
                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                    </div>
                                </div>
                            </div>
                            <p className='text-sm text-gray-600 font1 ml-10'>{rev.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500 font1 italic'>No reviews yet. Be the first to review this product!</p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
