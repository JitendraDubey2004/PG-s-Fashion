import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myOrders } from '../../action/orderaction';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';

const MyOrders = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user, isAuthentication } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthentication === false) {
            navigate('/Login');
        } else if (user) {
            dispatch(myOrders(user._id));
        }

        if (error) {
            alert.error(error);
        }
    }, [dispatch, error, alert, isAuthentication, navigate, user]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <div className='min-h-[70vh] bg-gray-50 py-10'>
                    <div className='w-[90%] lg:w-[60%] mx-auto bg-white p-6 shadow-sm rounded-md'>
                        <h1 className='text-2xl font1 font-bold mb-6 border-b pb-4'>My Orders</h1>

                        {orders && orders.length > 0 ? (
                            <div className='flex flex-col gap-6'>
                                {orders.map((order) => (
                                    <div key={order._id} className='border rounded-md p-4'>
                                        <div className='flex justify-between border-b pb-2 mb-4'>
                                            <div className='text-sm text-gray-500'>
                                                <p>Order ID: {order._id}</p>
                                                <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className='text-sm font-bold text-[#0db7af]'>
                                                Status: {order.paymentInfo.status === 'Succeeded' ? 'Confirmed' : 'Pending'}
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-4'>
                                            {order.orderItems.map((item) => (
                                                <div key={item._id} className='flex gap-4 items-center'>
                                                    {item.product && (
                                                        <>
                                                            <img 
                                                                src={item.product.images[0].url} 
                                                                alt={item.product.title} 
                                                                className='w-20 h-24 object-cover rounded'
                                                            />
                                                            <div className='flex-1'>
                                                                <Link to={`/products/${item.product._id}`}>
                                                                    <h2 className='font1 font-bold text-gray-800 hover:text-[#ff3f6c]'>
                                                                        {item.product.brand}
                                                                    </h2>
                                                                </Link>
                                                                <p className='text-sm text-gray-600 truncate w-[200px] lg:w-full'>{item.product.title}</p>
                                                                <p className='text-sm mt-1'>Qty: {item.qty}</p>
                                                            </div>
                                                            <div className='font-bold'>
                                                                &#8377; {item.product.sellingPrice * item.qty}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='text-center py-10 text-gray-500'>
                                <p className='text-lg mb-4'>You haven't placed any orders yet.</p>
                                <Link to='/' className='bg-[#ff3f6c] text-white px-6 py-2 rounded font-bold'>START SHOPPING</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default MyOrders;
