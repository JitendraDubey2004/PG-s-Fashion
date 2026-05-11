import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import Footer from '../Footer/Footer';

const Account = () => {
    const { user, loading, isAuthentication } = useSelector((state) => state.user);

    if (loading) return <Loader />;

    return (
        <Fragment>
            {isAuthentication && user ? (
                <div className="container mx-auto px-6 py-10 min-h-screen">
                    <h1 className="text-3xl font1 font-bold text-slate-800 mb-10 border-b pb-4">My Account</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Profile Section */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center">
                            <div className="w-32 h-32 bg-[#ff3f6c] rounded-full flex items-center justify-center text-5xl text-white font-bold mb-6">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font1 font-bold text-slate-800">{user.name}</h2>
                            <p className="text-slate-500 font1 mb-6">{user.email}</p>
                            <Link to="/me/update" className="w-full bg-[#ff3f6c] text-white py-3 rounded-md text-center font1 font-bold hover:bg-[#f64871] transition-colors">
                                Edit Profile
                            </Link>
                        </div>

                        {/* Details & Actions */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                                <h3 className="text-lg font1 font-bold text-slate-800 mb-6 uppercase tracking-wider">Account Overview</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs text-slate-400 font-bold uppercase mb-1">Full Name</label>
                                        <p className="text-slate-800 font1">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 font-bold uppercase mb-1">Email Address</label>
                                        <p className="text-slate-800 font1">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 font-bold uppercase mb-1">Role</label>
                                        <p className="text-slate-800 font1 capitalize">{user.role}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 font-bold uppercase mb-1">Joined On</label>
                                        <p className="text-slate-800 font1">{String(user.createdAt).substr(0, 10)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link to="/orders" className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-[#ff3f6c] transition-colors group">
                                    <h3 className="font1 font-bold text-slate-800 group-hover:text-[#ff3f6c]">My Orders</h3>
                                    <p className="text-sm text-slate-500 font1">View and track your purchases</p>
                                </Link>
                                <Link to="/my_wishlist" className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-[#ff3f6c] transition-colors group">
                                    <h3 className="font1 font-bold text-slate-800 group-hover:text-[#ff3f6c]">My Wishlist</h3>
                                    <p className="text-sm text-slate-500 font1">Items you've saved for later</p>
                                </Link>
                                <Link to="/password/update" className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:border-[#ff3f6c] transition-colors group">
                                    <h3 className="font1 font-bold text-slate-800 group-hover:text-[#ff3f6c]">Change Password</h3>
                                    <p className="text-sm text-slate-500 font1">Update your account security</p>
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="bg-[#1e1e1e] p-6 rounded-lg shadow-sm border border-slate-800 hover:bg-black transition-colors group">
                                        <h3 className="font1 font-bold text-white">Admin Dashboard</h3>
                                        <p className="text-sm text-slate-400 font1">Manage products, orders, and users</p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-screen flex items-center justify-center flex-col">
                    <h2 className="text-2xl font1 font-bold mb-4">Please login to view your account</h2>
                    <Link to="/login" className="bg-[#ff3f6c] text-white px-8 py-3 rounded-md font1 font-bold">Login</Link>
                </div>
            )}
            <Footer />
        </Fragment>
    );
};

export default Account;
