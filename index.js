const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/persons');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// Get all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch(next);
});

// Get info
app.get('/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const personCount = persons.length;
      const currentDate = new Date();
      res.send(
        `<p>Phonebook has info for ${personCount} people.<br/>${currentDate} </p>`
      );
    })
    .catch(next);
});

// Get person by id
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) {
        res.status(404).send({ error: 'Person not found' });
      } else {
        res.json(person);
      }
    })
    .catch(next);
});

// Delete person by id
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        res.status(404).send({ error: 'Person not found' });
      } else {
        res.status(204).end();
      }
    })
    .catch(next);
});

// Add new person
app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: 'Name is missing' });
  } else if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch(next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
