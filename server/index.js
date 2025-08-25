const express = require('express');
const { connection } = require("./src/config/dbConnect");
const cookieParser = require("cookie-parser");
const redisClient = require("./src/config/redis.js");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api', require('./src/routes/authRouter.js'));
app.use('/api', require('./src/routes/jobRouter.js'));


connection.connect().then(() => {
  redisClient.connect().then(() => {
    console.log('Connected to Redis');
  }).catch((err) => {
    console.error('Redis connection error:', err);
  });
  app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});