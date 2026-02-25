const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');
const profileRepo = require('../repositories/profileRepo');

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
    throw new Error('JWT_SECRET not set');
}

exports.register = async (email, password) => {
    const hash = bcrypt.hashSync(password, 8);
    const user = await userRepo.create(email, hash);
    await profileRepo.createForUser(user.id, email);
    return user;
};

exports.login = async (email, password) => {
    const user = await userRepo.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Invalid credentials');
    }

    return jwt.sign({id: user.id, email}, SECRET);
};
