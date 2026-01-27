const db = require('../db');

exports.createForUser = (userId, email) =>
    new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO profiles (user_id, display_name, bio)
             VALUES (?, ?, ?)`,
            [userId, email.split('@')[0], ''],
            (err) => (err ? reject(err) : resolve())
        );
    });
