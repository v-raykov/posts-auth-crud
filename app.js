require('dotenv').config();
const express = require('express');
require('./db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server running');
    });
}

module.exports = app;
