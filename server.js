const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception.');
  console.log(err.name, err.message);

  process.exit(1);
});
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((conn) => {
    console.log('Connection Successfull');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('System is running');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection.');
  server.close(() => {
    process.exit(1);
  });
});

////////////////////////////////////////////////////
// const testTour = new Tour({
//   name: 'The Snow Mountain',
//   price: 230,
//   rating: 4.5,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error 🔥', err));
