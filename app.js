const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const personsRouter = require('./controllers/persons');

const mongoose = require('mongoose');

const Person = require('./models/persons');
const config = require('./utils/config');
const logger = require('./utils/logger');

const url = config.MONGODB_URI;

mongoose.set('strictQuery', false);
logger.info('Connecting to MongoDB Atlas');
mongoose
  .connect(url)
  .then(() => {
    logger.info('Connected to MongoDB Atlas.');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB Atlas: ', error.message);
  });

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/persons', personsRouter);

//  Get info
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
});

module.exports = app;
