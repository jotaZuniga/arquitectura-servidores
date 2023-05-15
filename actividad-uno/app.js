require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./config/routes.config');
const notFound = require('./middleware/errors');

// middlewares
app.use(express.json());
app.use('/api', routes);

// error
app.use(notFound);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server up and running... on port ${process.env.PORT}`);
});