require('dotenv').config()
const express = require("express");
const app = express();

var morgan = require('morgan');
const Person = require('./models/person');

app.use(express.static('dist'))
app.use(express.json());

morgan.token('body', (req, res) => {
    return req.method == 'POST' ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get("/info", (req,res)=>{
    Person.find({}).then((people) => {
        const totalData = people.length;
        const currentTime = new Date();
        res.send(`<div><p>Phonebook has info for ${totalData} people</p><p>${currentTime}</p></div>`)
    })
})

app.get("/api/persons", (req,res)=>{
    Person.find({}).then((people) => {
        res.json(people)
    })
})

app.get("/api/persons/:id", (req,res,next)=>{
    const id = req.params.id
    Person.findById(id).then((data) => {
        if(data){
            res.json(data)            
        }else{
            res.status(404).json({error: "Person not found"})
        }
    }).catch(error => next(error))
})

app.post("/api/persons", (req,res,next)=>{
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({error : "content is missing"})
    }

    const newPerson = new Person(body)

    newPerson.save().then(data => {
        res.status(201).json(data)
    }).catch(error => next(error))
})

app.put("/api/persons/:id", (req,res,next) => {
    const {name, number} = req.body

    Person.findById(req.params.id).then(data =>{

        if(!data){
            return res.status(404).end()
        }

        data.name = name,
        data.number = number

        return data.save().then(updatePesron => {
          res.json(updatePesron) 
        })

    }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req,res,next)=>{
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(result =>{
        res.status(204).end()
    }).catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error : error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})