const express = require('express');
const cors = require('cors');
const path = require("path");
const sequelize = require('./sequelize');
const app = express();
const port = process.env.PORT;
const routes = require('./routes/index');
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);

(async () => {
    try {
        await sequelize.sync();
        console.log('database is connected');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
