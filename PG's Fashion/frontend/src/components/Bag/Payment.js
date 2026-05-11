import React, { Fragment, useEffect, useState } from 'react'
import { BsShieldFillCheck } from 'react-icons/bs'
import { getbag, createOrder, clearErrors } from '../../action/orderaction'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Loader from '../Loader/Loader'

const Payment = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const { bag, loading: bagLoading } = useSelector((state) => state.bag_data);
    const { error, success } = useSelector((state) => state.newOrder);

    const [totalPrice, setTotalPrice] = useState(0);
    const [loadingPayment, setLoadingPayment] = useState(false);

    useEffect(() => {
        if (bag) {
            let total = 0;
            bag.orderItems.forEach((item) => {
                total += item.product.sellingPrice * item.qty;
            });
            setTotalPrice(total);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            navigate("/success");
        }
    }, [dispatch, bag, error, alert, success, navigate]);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const checkoutHandler = async (e) => {
        e.preventDefault();
        setLoadingPayment(true);

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert.error("Razorpay SDK failed to load. Are you online?");
            setLoadingPayment(false);
            return;
        }

        try {
            // Get Razorpay key
            const { data: { stripeApiKey } } = await axios.get("/api/v1/razorpayapikey");

            // Create Order on Backend
            const { data: { order } } = await axios.post("/api/v1/payment/process", { amount: totalPrice });

            const options = {
                key: stripeApiKey,
                amount: order.amount,
                currency: "INR",
                name: "PG's Fashion",
                description: "Payment for your shopping bag",
                image: "https://www.pgsfashion.com/logo.png", // Optional
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const verifyRes = await axios.post("/api/v1/payment/verification", verifyData);

                        if (verifyRes.data.success) {
                            // Payment verified, create final order in DB
                            const orderData = {
                                user: user._id,
                                orderItems: bag.orderItems.map(item => ({
                                    product: item.product._id,
                                    qty: item.qty
                                })),
                                paymentInfo: {
                                    status: "Succeeded",
                                    id: response.razorpay_payment_id
                                },
                            };
                            dispatch(createOrder(orderData));
                        } else {
                            alert.error("Payment verification failed");
                        }
                    } catch (error) {
                        alert.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phonenumber,
                },
                notes: {
                    address: "PG's Fashion Corporate Office",
                },
                theme: {
                    color: "#ff3f6c",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            // Handle payment modal close or failure
            paymentObject.on('payment.failed', function (response){
                alert.error(response.error.description);
                setLoadingPayment(false);
            });

        } catch (error) {
            console.log(error);
            alert.error("Could not initialize payment. Please try again.");
            setLoadingPayment(false);
        }
    };

    return (
        <Fragment>
            {bagLoading || loadingPayment ? <Loader /> : (
                <Fragment>
                    <div className='relative h-max border-[0.5px] border-b-slate-100 py-5 select-none'>
                        <div className='mx-auto text-[#696B79] w-max'>
                            <span className="font text-[14px] font-semibold tracking=[3px] text-[#696B79]">BAG</span> ----------&nbsp;
                            <span className="font text-[14px] font-semibold tracking=[3px] text-[#696B79]">ADDRESS</span> ---------- &nbsp;
                            <span className="font text-[14px] underline font-semibold tracking=[3px] text-[#0db7af]">PAYMENT</span>
                        </div>
                        <span className='absolute items-center flex right-0 top-0 2xl:right-10 xl:right-10 lg:right-10 2xl:top-2 xl:top-2 lg:top-2 '>
                            <BsShieldFillCheck className='text-[#0db7af] 2xl:text-3xl xl:text-3xl lg:text-3xl ' />
                            <span className='font1 font-semobold  text-[#535766] tracking-[3px]  2xl:text-[12px] xl:text-[12px] lg:text-[12px] text-[8px] ml-2  '>100% SECURE</span>
                        </span>
                    </div>

                    <div className='mx-auto select-none 2xl:w-[40%] xl:w-[40%] lg:w-[40%] mt-8 p-4 border-[1px] border-slate-200 rounded-md shadow-sm'>
                        <h1 className='font1 font-bold text-[18px] text-[#282c3f] border-b-[1px] pb-4'>Payment Options</h1>
                        
                        <div className='mt-6'>
                            <div className='flex items-center p-4 border-[1px] border-[#ff3f6c] rounded-md cursor-pointer bg-pink-50'>
                                <input type="radio" name="payment" id="razorpay" className='accent-pink-500' checked readOnly />
                                <label htmlFor="razorpay" className='ml-4 font1 font-bold text-[#424553]'>Pay with Razorpay (Cards, UPI, NetBanking)</label>
                            </div>
                        </div>

                        <div className='mt-8 bg-slate-50 p-4 rounded-md'>
                            {couponInfo && (
                                <div className='flex justify-between font1 text-green-600 mb-2'>
                                    <span>Coupon Discount ({couponInfo.coupon}):</span>
                                    <span className='font-bold'>-&#8377; {couponInfo.discountAmount}</span>
                                </div>
                            )}
                            <div className='flex justify-between font1 text-[#535766]'>
                                <span>Order Total:</span>
                                <span className='font-bold text-black'>&#8377; {totalPrice}</span>
                            </div>
                        </div>

                        <button 
                            className='mt-6 bg-[#ff3f6c] text-center w-full py-3 font1 text-bold text-white rounded-sm uppercase tracking-wider'
                            onClick={checkoutHandler}
                            disabled={loadingPayment}
                        > 
                            {loadingPayment ? "Processing..." : `Pay ₹ ${totalPrice}`}
                        </button>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Payment
