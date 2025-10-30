import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setMessage(state, action){
            const message = action.payload
            return message
        }
    },
})

export const { setMessage } = notificationSlice.actions

export default notificationSlice.reducer