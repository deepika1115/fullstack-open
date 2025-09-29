import { createSelector } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const selectSortedAnecdotes = createSelector(
        state => state.anecdotes,
        state => state.filter,
        (anecdotes, filter) => {
            const filteredAnecdotes = filter ?
                anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase())) :
                anecdotes
            return [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
        }
    )
    const anecdotes = useSelector(selectSortedAnecdotes)

    const dispatch = useDispatch()
    
    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }

    return(
        <div>
            {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote)}>vote</button>
                </div>
            </div>
        )}
      </div>
    )
}

export default AnecdoteList