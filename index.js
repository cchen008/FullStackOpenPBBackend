const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/info', (request, response) => {
    const length = persons.length;
    const currentDate = new Date();
    //console.log(currentDate);
    response.send(`<p>Phonebook has info for ${length} people <br/><br/>
        ${currentDate}
    </p>`)
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person){
        response.json(person);
    }
    else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id); 
   persons = persons.filter(person => person.id !== id);

   response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const newPerson = request.body;
    const exist = persons.filter(person => person.name === newPerson.name);

    if(!newPerson.name) {
        return response.status(400).json({
            error: 'name is missing'
        });
    }
    else if(exist.length > 0) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }
    if(!newPerson.number) {
        return response.status(400).json({
            error: 'number is missing'
        });
    }
    const id = Math.floor(Math.random() * 99999999);
    newPerson.id = id;
    persons.push(newPerson);

    response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});