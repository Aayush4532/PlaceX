const express = require('express');
const { connection } = require("./src/config/dbConnect");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', require('./src/routes/authRouter.js'));
app.use('/api', require('./src/routes/jobRouter.js'));


connection.connect().then(() => {
  app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});