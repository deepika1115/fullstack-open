import { useState } from 'react'

const Heading = ({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Anecdote = ({anecdote, votes}) => {
  return (
    <>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const setVote = ()=>{
    const newVotes = [... votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  }
  const nextAnecdote = () =>{
    const randomInt = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomInt)
  }

  let maxVote = Math.max(...votes);
  let mostVoted = votes.indexOf(maxVote);

  return (
    <div>
      <Heading text="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]}/>

      <Button onClick={setVote} text="vote"/>
      <Button onClick={nextAnecdote} text="next anecdote"/>
      <br />
      {maxVote > 0 && (
        <>
          <Heading text="Anecdote with most votes" />
          <Anecdote anecdote={anecdotes[mostVoted]} votes={votes[mostVoted]}/>
        </>
      )}     
    </div>
  )
}

export default App