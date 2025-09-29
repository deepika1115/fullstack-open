import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      return state.map(a => a.id === action.payload.id ? action.payload : a)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, updateAnecdote, setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const anecdoteToChange = anecdotes.find(a => a.id === id)
    const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
     const updatedAnecdote = await anecdoteService.updateAnecdote(id, changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}
export default anecdoteSlice.reducer