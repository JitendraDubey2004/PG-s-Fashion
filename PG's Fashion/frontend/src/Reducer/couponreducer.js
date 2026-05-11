import {
    APPLY_COUPON_REQUEST,
    APPLY_COUPON_SUCCESS,
    APPLY_COUPON_FAIL,
    REMOVE_COUPON,
    CLEAR_ERRORS
} from '../const/couponconst';

const getSessionCoupon = () => {
    const data = sessionStorage.getItem("couponInfo");
    if (data) return JSON.parse(data);
    return null;
};

const initialState = {
    couponInfo: getSessionCoupon()
};

export const couponReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPLY_COUPON_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case APPLY_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                couponInfo: action.payload,
                error: null
            };
        case APPLY_COUPON_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case REMOVE_COUPON:
            return {
                ...state,
                couponInfo: null,
                error: null
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
