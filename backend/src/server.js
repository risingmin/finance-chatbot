const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./api/routes');
const config = require('./config');

const app = express();
const PORT = config.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});