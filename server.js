import app from './app.js';
import mongoose from 'mongoose';

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    });
  })
  .catch(erorr => {
    console.log(erorr.message);
    process.exit(1);
  });

