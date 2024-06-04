import bcrypt from 'bcryptjs';
import dbConnect from '../utils/db-connector.js';
import { SignJWT } from 'jose';
import dotenv from 'dotenv';
dotenv.config();

function validateData(body) {
    const email = body.email;
    const password = body.password;
    try {
        if (email === undefined || email === "" || email.length < 3 || email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            return ({ is_valid: false, msg: "Email is required" });
        }
        if (password === undefined || password === "" || password.length < 6) {
            return ({ is_valid: false, msg: "Password is required" });
        }
        return ({ is_valid: true, msg: "Data is valid" });
    } catch (error) {
        console.log(error);
        return ({ is_valid: false, msg: "Error validating data" });
    }
}

async function loginUser(email, password) {
    let client;
    try {
        client = await dbConnect.connect();
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await client.query(query, [email]);
        client.release();
        if (result.rows.length === 0) {
            return ({ is_success: false, msg: "User not found" });
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return ({ is_success: false, msg: "Invalid Credentials" });
        }
        user.password = undefined;
        return ({ is_success: true, user, msg: "User Found"});
    }
    catch (error) {
        console.log(error);
        if (client) client.release();
        return ({ is_success: false, msg: "Error logging in" });
    }
}



async function loginController(req, res) {
    try {
        const { is_valid, msg } = validateData(req.body);
        if (!is_valid) {
            return res.status(400).json({ msg });
        }
        const email = req.body.email;
        const password = req.body.password;
        const { is_success, user, msg: loginMsg } = await loginUser(email, password);
        if (!is_success) {
            return res.status(400).json({ msg: loginMsg });
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: user.id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);
        return res.status(200).json({ user, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Error logging in" });
    }
}

export default loginController;