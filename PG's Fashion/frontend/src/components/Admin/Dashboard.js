import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';

const Dashboard = () => {
    const { user, isAuthentication, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const alert = useAlert();

    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        products: 0,
        totalAmount: 0
    });
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading === false) {
            if (isAuthentication === false) {
                navigate('/Login');
            } else if (user.role !== 'admin') {
                alert.error("You do not have permission to access the admin dashboard.");
                navigate('/');
            } else {
                fetchStats();
            }
        }
    }, [isAuthentication, user, loading, navigate, alert]);

    const fetchStats = async () => {
        try {
            const usersRes = await axios.get('/api/v1/admin/users');
            const ordersRes = await axios.get('/api/v1/admin/orders');
            const productsRes = await axios.get('/api/v1/admin/products');

            setStats({
                users: usersRes.data.users.length,
                orders: ordersRes.data.orders.length,
                products: productsRes.data.products.length,
                totalAmount: ordersRes.data.totalAmount
            });
        } catch (error) {
            alert.error("Failed to fetch admin statistics");
        } finally {
            setFetching(false);
        }
    };

    if (loading || fetching) return <Loader />;

    return (
        <div className='min-h-[70vh] bg-gray-50 py-10 px-4'>
            <div className='max-w-6xl mx-auto'>
                <h1 className='text-3xl font1 font-bold text-gray-800 mb-8 border-b pb-4'>Admin Dashboard</h1>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#ff3f6c]'>
                        <h2 className='text-gray-500 font1 text-sm uppercase tracking-wider mb-2'>Total Sales</h2>
                        <p className='text-3xl font-bold text-gray-800'>&#8377; {Math.round(stats.totalAmount)}</p>
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500'>
                        <h2 className='text-gray-500 font1 text-sm uppercase tracking-wider mb-2'>Products</h2>
                        <p className='text-3xl font-bold text-gray-800'>{stats.products}</p>
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500'>
                        <h2 className='text-gray-500 font1 text-sm uppercase tracking-wider mb-2'>Orders</h2>
                        <p className='text-3xl font-bold text-gray-800'>{stats.orders}</p>
                    </div>

                    <div className='bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500'>
                        <h2 className='text-gray-500 font1 text-sm uppercase tracking-wider mb-2'>Users</h2>
                        <p className='text-3xl font-bold text-gray-800'>{stats.users}</p>
                    </div>
                </div>

                <div className='mt-10 bg-white p-6 rounded-lg shadow-sm'>
                    <h2 className='text-xl font1 font-bold mb-4'>Quick Actions</h2>
                    <div className='flex gap-4'>
                        <button className='bg-[#ff3f6c] text-white px-4 py-2 rounded font1 text-sm font-bold'>Add Product</button>
                        <button className='bg-gray-800 text-white px-4 py-2 rounded font1 text-sm font-bold'>Manage Orders</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
