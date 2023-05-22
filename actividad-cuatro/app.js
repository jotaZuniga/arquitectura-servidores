require('dotenv').config();

const express = require('express');
const morgan = require('morgan');


const app = express();
const routes = require('./config/routes.config');
const errorHandler = require('./middleware/errors');

require('./config/db.config');

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use('/api', routes);

// error
app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server up and running... on port ${process.env.PORT}`);
});