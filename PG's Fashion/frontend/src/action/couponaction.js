import {
    APPLY_COUPON_REQUEST,
    APPLY_COUPON_SUCCESS,
    APPLY_COUPON_FAIL,
    REMOVE_COUPON,
    CLEAR_ERRORS
} from '../const/couponconst';
import axios from 'axios';

export const applyCoupon = (code, cartTotal) => async (dispatch) => {
    try {
        dispatch({ type: APPLY_COUPON_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.post(`/api/v1/coupon/apply`, { code, cartTotal }, config);

        dispatch({
            type: APPLY_COUPON_SUCCESS,
            payload: data,
        });

        // Store in session storage to persist across steps
        sessionStorage.setItem("couponInfo", JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: APPLY_COUPON_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const removeCoupon = () => (dispatch) => {
    sessionStorage.removeItem("couponInfo");
    dispatch({ type: REMOVE_COUPON });
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
