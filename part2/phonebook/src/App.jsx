import { useState, useEffect } from 'react';
import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterText, setFilterText] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(()=> {
    personService
      .getAll()
      .then(personData => 
        setPersons(personData)
      );
  },[])

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  }

  const showMessage = (type,text) => {
    setMessage({type, text})
    setTimeout(()=>{
      setMessage(null)
    },5000)
  }

  const addPerson = (event) => {
    event.preventDefault();
    const personExist = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if(personExist){
      const confirmUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(confirmUpdate){
        //update person
        personService
          .update(personExist.id, {name: newName, number: newNumber})
          .then(personData => {
            setPersons(persons.map((person) => person.id === personData.id ? personData : person))
            showMessage("notification", `${personData.name}'s number updated`)
            setNewName("")
            setNewNumber("")
          }).catch(error => {console.log(error)
            showMessage("error", error.response.data.error)
          })
      }
    }else{
      const newPerson = {name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(personData => {
          setPersons(persons.concat(personData))
          showMessage("notification", `${personData.name} added`)
          setNewName("")
          setNewNumber("")
        }).catch(error => {
          showMessage("error", error.response.data.error)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (person) => {
    const confirmDelete = window.confirm(`delete ${person.name} ?`)
    if(confirmDelete){
      personService
      .remove(person.id)
      .then(result => {
        setPersons(persons.filter(p => p.id !== person.id))
        showMessage("notification", ` ${person.name} deleted`)
      }).catch(error => {
        showMessage("error",`Information of ${person.name} has already been removed from server`)
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }

  const personList = filterText ? persons.filter((p)=> {
    return p.name.toLowerCase().includes(filterText.toLowerCase());
  }) : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message}/>

      <Filter value={filterText} handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>

      <PersonForm name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />

      <h3>Numbers</h3>
      
      <Persons persons={personList} onDelete={handleDelete} />
    </div>
  )
}

export default App