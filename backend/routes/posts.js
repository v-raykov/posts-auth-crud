const express = require('express');
const auth = require('../middleware/auth');
const postRepo = require('../repositories/postRepo');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
    const authHeader = req.headers.authorization;
    let userId = 0;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
            if (!err) userId = decoded.id;
        });
    }
    postRepo.getAll(userId).then(posts => res.json(posts));
});

router.post('/', auth, async (req, res) => {
    const post = await postRepo.create(
        req.user.id,
        req.body.title,
        req.body.content
    );
    res.json(post);
});

router.put('/:id', auth, async (req, res) => {
    await postRepo.update(
        req.params.id,
        req.user.id,
        req.body.title,
        req.body.content
    );
    res.json({success: true});
});

router.post('/:id/like', auth, async (req, res) => {
    try {
        await postRepo.like(req.params.id, req.user.id);
        res.json({success: true});
    } catch(e) {
        res.status(400).json({error: 'Already liked'});
    }
});

router.post('/:id/unlike', auth, async (req, res) => {
    try {
        await postRepo.unlike(req.params.id, req.user.id);
        res.json({success: true});
    } catch(e) {
        res.status(400).json({error: 'Not liked'});
    }
});

router.delete('/:id', auth, async (req, res) => {
    await postRepo.remove(req.params.id, req.user.id);
    res.json({success: true});
});

module.exports = router;
