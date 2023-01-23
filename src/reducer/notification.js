import { createContext } from "react";


const initialStateNotification = {
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: "",
    type: "error"
}
const openActionNotification = (message, type = "success") => ({
    type: "OPEN",
    payload: {
        open: true,
        type,
        message,
    }
});
const closeActionNotification = () => ({
    type: "CLOSE",
    payload: {
        open: false,
    }
});

const notificationReducer = (state, action) => {
    switch (action.type) {
        case "OPEN":
            return { ...state, ...action.payload }
        case "CLOSE":
            return { ...state, ...action.payload }
        default:
            return state;
    }
}
const NotificationContext = createContext();
export { NotificationContext, initialStateNotification, openActionNotification, closeActionNotification }
export default notificationReducer