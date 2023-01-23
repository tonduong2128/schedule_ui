import { createContext } from "react";


const initialStateLoading = {
    open: false,
}
const openActionLoading = () => ({
    type: "OPEN",
    payload: {
        open: true,
    }
});
const closeActionLoading = () => ({
    type: "CLOSE",
    payload: {
        open: false,
    }
});

const loadingReducer = (state, action) => {
    switch (action.type) {
        case "OPEN":
            return { ...state, ...action.payload }
        case "CLOSE":
            return { ...state, ...action.payload }
        default:
            return state;
    }
}
const LoadingContext = createContext();
export { LoadingContext, initialStateLoading, openActionLoading, closeActionLoading }
export default loadingReducer