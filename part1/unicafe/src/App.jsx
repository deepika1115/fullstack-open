import { useState } from 'react'

const Button = props => <button onClick={props.onClick}>{props.text}</button>

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if(good === 0 && neutral === 0 && bad === 0){
    return <p>No feedback given</p>
  }
  const total = good + neutral + bad;
  const average = ((good * 1) + (neutral * 0) + (bad * -1))/total;
  const positive = (good/total)*100;
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value ={total} />
          <StatisticLine text="average" value ={average} />
          <StatisticLine text="positive" value ={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={()=> setGood(good + 1)} text="good"/>
      <Button onClick={()=>{setNeutral(neutral + 1)}} text="neural"/>
      <Button onClick={()=>{setBad(bad + 1)}} text="bad"/>
      <br />
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
