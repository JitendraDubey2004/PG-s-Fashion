import {
    REQUEST_PRODUCTS,
    SUCCESS_PRODUCTS,
    FAIL_PRODUCTS,
    REQUEST_SINGLE_PRODUCTS,
    SUCCESS_SINGLE_PRODUCTS,
    FAIL_SINGLE_PRODUCTS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_RESET,
    CLEAR_ERRORS
} from '../const/productconst'

export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case NEW_REVIEW_RESET:
            return {
                ...state,
                success: false,
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

export const Allproducts = (state = {product:{}}, action) =>{
    switch (action.type) {
        case REQUEST_PRODUCTS:
            return {
                loading: true,
                
            };

        case SUCCESS_PRODUCTS:
            return {
                loading: false,
                product:action.payload,
                pro: action.pro,
                length:action.length
            };

        case FAIL_PRODUCTS:
                return {
                    loading: false,
                    error:action.payload
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}

export const singleProduct = (state = {Sproduct:{}}, action) =>{
    switch (action.type) {
        case REQUEST_SINGLE_PRODUCTS:
            return {
                loading: true,
            };

        case SUCCESS_SINGLE_PRODUCTS:
            return {
                loading: false,
                product:action.payload,
                similar: action.similar
            };

        case FAIL_SINGLE_PRODUCTS:
                return {
                    loading: false,
                    error:action.payload
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}
