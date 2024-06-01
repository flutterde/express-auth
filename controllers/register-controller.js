import bcrypt from 'bcryptjs';
import dbConnect from '../utils/db-connector.js';
import { SignJWT } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

function validateData(body) {
    const email = body.email;
    const password = body.password;
    const name = body.name;
    try {
        if (email === undefined || email === "" || email.length < 3 || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            return ({ is_valid: false, msg: "Email is required" });
        }
        if (password === undefined || password === "" || password.length < 6) {
            return ({ is_valid: false, msg: "Password is required" });
        }
        if (name === undefined || name === "" || name.length < 3) {
            return ({ is_valid: false, msg: "Name is required" });
        }
        return ({ is_valid: true, msg: "Data is valid" });
    } catch (error) {
        console.log(error);
        return ({ is_valid: false, msg: "Error validating data" });
    }
}

async function createUser(email, password, name) {
    let client;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        client = await dbConnect.connect();
        const query = `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name`;
        const result = await client.query(query, [email, hashedPassword, name]);
        client.release();
        return ({ is_success: true, user: result.rows[0] });
    } catch (error) {
        console.log(error);
        if (client) client.release();
        return ({ is_success: false, msg: "Error creating user" });
    }
}

async function generateToken(user) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
    return (token);
}

async function registerController(req, res) {
    const { is_valid, msg } = validateData(req.body);
    if (!is_valid) {
        return res.status(400).json({ msg });
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const { is_success, user, msg: createUserMsg } = await createUser(email, password, name);
    if (!is_success) {
        return res.status(500).json({ msg: createUserMsg });
    }
    const token = await generateToken(user);
    return res.status(201).json({ user, token });
}

export default registerController;
