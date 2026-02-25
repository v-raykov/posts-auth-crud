const express = require('express');
const auth = require('../middleware/auth');
const postRepo = require('../repositories/postRepo');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const posts = await postRepo.getByUser(req.user.id);
    res.json(posts);
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

router.delete('/:id', auth, async (req, res) => {
    await postRepo.remove(req.params.id, req.user.id);
    res.json({success: true});
});

module.exports = router;
