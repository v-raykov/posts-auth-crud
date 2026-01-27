const db = require('../db');

exports.create = (email, password) =>
    new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, password],
            function (err) {
                if (err) reject(err);
                else resolve({id: this.lastID, email});
            }
        );
    });

exports.findByEmail = (email) =>
    new Promise((resolve) => {
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (_, row) => resolve(row)
        );
    });
