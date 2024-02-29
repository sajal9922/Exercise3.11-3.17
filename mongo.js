const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://fullstack:${password}@cluster-demo.7tbn5u1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster-demo`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // If only password is provided, display all entries in the database
  Person.find({})
    .then((people) => {
      console.log('Phonebook:');
      people.forEach((person) => {
        console.log(`${person.name}: ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error fetching entries:', error);
      mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
  // If password and person's details are provided, add the person to the database

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`);
      //console.log(savedPerson);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.error('Error saving person:', error);
      mongoose.connection.close();
    });
} else {
  console.log('Usage: node mongo.js <password>');
  process.exit(1);
}
