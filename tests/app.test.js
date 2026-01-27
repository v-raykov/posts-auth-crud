const request = require('supertest');
const app = require('../app');

describe('POC happy path', () => {
    let token;
    let postId;

    it('registers a user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@test.com',
                password: '1234'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('test@test.com');
    });

    it('logs in', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: '1234'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });

    it('creates a post', async () => {
        const res = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Hello',
                content: 'World'
            });

        expect(res.statusCode).toBe(200);
        postId = res.body.id;
    });

    it('gets posts', async () => {
        const res = await request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.length).toBe(1);
    });

    it('updates post', async () => {
        const res = await request(app)
            .put(`/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated',
                content: 'Still world'
            });

        expect(res.body.success).toBe(true);
    });

    it('deletes post', async () => {
        const res = await request(app)
            .delete(`/posts/${postId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.success).toBe(true);
    });
});
