const db = require('../db');

exports.getByUser = (userId) =>
    new Promise((resolve) => {
        db.all(
            'SELECT * FROM posts WHERE user_id = ?',
            [userId],
            (_, rows) => resolve(rows)
        );
    });

exports.create = (userId, title, content) =>
    new Promise((resolve) => {
        db.run(
            'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
            [userId, title, content],
            function () {
                resolve({id: this.lastID, title, content});
            }
        );
    });

exports.update = (postId, userId, title, content) =>
    new Promise((resolve) => {
        db.run(
            `UPDATE posts
             SET title = ?,
                 content = ?
             WHERE id = ?
               AND user_id = ?`,
            [title, content, postId, userId],
            () => resolve()
        );
    });

exports.remove = (postId, userId) =>
    new Promise((resolve) => {
        db.run(
            'DELETE FROM posts WHERE id = ? AND user_id = ?',
            [postId, userId],
            () => resolve()
        );
    });
