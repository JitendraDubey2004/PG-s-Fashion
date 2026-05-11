import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { BsCheckCircleFill } from 'react-icons/bs'

const OrderSuccess = () => {
    return (
        <Fragment>
            <div className='flex flex-col items-center justify-center min-h-[70vh] px-4'>
                <BsCheckCircleFill className='text-[#0db7af] text-8xl mb-6 animate-bounce' />
                <h1 className='font1 text-3xl font-bold text-[#282c3f] mb-4 text-center'>Your Order has been Placed successfully</h1>
                <p className='text-[#696B79] text-center mb-8 max-w-md'>
                    Thank you for shopping with PG's Fashion. You will receive an email confirmation shortly with your order details.
                </p>
                <Link 
                    to="/" 
                    className='bg-[#ff3f6c] text-white px-10 py-3 font1 font-bold rounded-sm hover:shadow-lg transition-all duration-300'
                > 
                    CONTINUE SHOPPING 
                </Link>
            </div>
        </Fragment>
    )
}

export default OrderSuccess
