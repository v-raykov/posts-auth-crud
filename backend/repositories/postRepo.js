const db = require('../db');

exports.getByUser = (userId) =>
    new Promise((resolve) => {
        db.all(
            'SELECT * FROM posts WHERE user_id = ?',
            [userId],
            (_, rows) => resolve(rows)
        );
    });

exports.getAll = (userId) =>
    new Promise((resolve) => {
        db.all(
            `SELECT posts.*, users.email AS author, 
            (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) as liked
            FROM posts JOIN users ON posts.user_id = users.id`,
            [userId || 0],
            (_, rows) => resolve(rows)
        );
    });

exports.create = (userId, title, content) =>
    new Promise((resolve) => {
        db.run(
            'INSERT INTO posts (user_id, title, content, likes) VALUES (?, ?, ?, 0)',
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

exports.like = (postId, userId) =>
    new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
            [postId, userId],
            function (err) {
                if (err) return reject(err);
                db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], () => resolve());
            }
        );
    });

exports.unlike = (postId, userId) =>
    new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId],
            function (err) {
                if (err) return reject(err);
                db.run('UPDATE posts SET likes = likes - 1 WHERE id = ?', [postId], () => resolve());
            }
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
