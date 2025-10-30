import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state,action){
            return action.payload
        },
        createBlog(state, action){
            state.push(action.payload)
        },
        editBlog(state, action){
            const blog = action.payload
            return state.map(s => s.id === blog.id ? {...s, likes : blog.likes} : s)
        },
        deleteBlog(state, action){
            const blog = action.payload
            return state.filter(s => s.id !== blog.id)
        }
    }
})

export const { setBlogs, createBlog, editBlog, deleteBlog } = blogSlice.actions

export default blogSlice.reducer