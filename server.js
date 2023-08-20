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

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Err Str : tour must have name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Err Str : tour must have price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

// const testTour = new Tour({
//   name: 'The Snow Mountain',
//   price: 230,
//   rating: 4.5,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log('Error 🔥', err));

const port = 3000;
app.listen(port, () => {
  console.log('System is running');
});
