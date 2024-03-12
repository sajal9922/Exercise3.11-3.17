const personsRouter = require('express').Router();
const Person = require('../models/persons');
const express = require('express');
const app = express();

// Get all persons
personsRouter.get('/', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch(next);
});

// Get info
personsRouter.get('/info', (req, res, next) => {
  console.log('works1');
  Person.find({})
    .then((persons) => {
      const personCount = persons.length;
      const currentDate = new Date();
      console.log('we are here');
      res.send(
        `<p>Phonebook has info for ${personCount} people.<br/>${currentDate} </p>`
      );
    })
    .catch(next);
});

// Get person by id
personsRouter.get('/:id', (req, res, next) => {
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
personsRouter.delete('/:id', (req, res, next) => {
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
personsRouter.post('/', (req, res, next) => {
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

module.exports = personsRouter;
