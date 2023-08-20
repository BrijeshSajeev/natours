const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
    // console.log(conn.connection);
    console.log('Connection Successfull');
  });

const port = 3000;
app.listen(port, () => {
  console.log('System is running');
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
