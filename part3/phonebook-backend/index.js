const express = require("express");
const app = express();

var morgan = require('morgan');

app.use(express.json());

morgan.token('body', (req, res) => {
    return req.method == 'POST' ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

function generateRandomId(){
    let id;
    do {
        id = String(Math.floor(Math.random() * 1000000))
    }while(persons.some(p => p.id === id))
        return id
    
}

app.get("/", (req,res)=>{
    res.send("<h1>Hello from Phonebook Backend</h1>");
})

app.get("/info", (req,res)=>{
    const totalData = persons.length;
    const currentTime = new Date();
    res.send(`<div><p>Phonebook has info for ${totalData} people</p><p>${currentTime}</p></div>`)
})

app.get("/api/persons", (req,res)=>{
    res.json(persons);
})

app.get("/api/persons/:id", (req,res)=>{
    const id = req.params.id;
    const data = persons.find(p => p.id === id)
    if(!data){
        return res.status(404).json({error: "Person not found"})
    }
    res.json(data)
})

app.post("/api/persons", (req,res)=>{
    const body = req.body;

    if(!body.name || !body.number){
        return res.status(400).json({error : "content is missing"})
    }

    const isNameExist = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase());
    if(isNameExist){
        return res.status(400).json({error : "name must be unique"}) 
    }

    const id = generateRandomId();
    const newPerson = {...body, id : id};
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson)
})

app.delete("/api/persons/:id", (req,res)=>{
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})