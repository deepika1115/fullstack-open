import { useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import  AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import NotificationContext from './NotificationContext'


const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn : getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false
  })

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a))
    }
  })

  const [ , dispatch] = useContext(NotificationContext)

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    dispatch({type: 'SET', payload: `anecdote '${anecdote.content}' is voted`})
    setTimeout(() => {
      dispatch({type: 'CLEAR'})
    }, 5000)
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if(result.isError) {
    return <div>anecdote service not vaailable due to problems in server</div>
  }

  const anecdotes = [...result.data].sort((a,b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
