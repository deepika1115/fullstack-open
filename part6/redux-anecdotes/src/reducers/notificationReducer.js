import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers : {
        setMessage(state, action) {
            return action.payload
        },
        removeMessage(state, action) {
            return ''
        }
    }
})

const { setMessage, removeMessage } =  notificationSlice.actions

export const setNotification = (message, timeInSeconds) => {
    return async dispatch => {
        dispatch(setMessage(message))
        setTimeout(() => {
            dispatch(removeMessage())
        }, timeInSeconds * 1000)
    }
}

export default notificationSlice.reducer
