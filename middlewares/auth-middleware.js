import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();



async function verifyToken(token) {
    try {
        const splitedToken = token.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const result = await jwtVerify(splitedToken, secret);
        return { is_valid: true, msg: "Token is valid", user: result.payload };
    } catch (error) {
        console.log("Error verifying token:: ", error);
        if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            console.log('Signature verification failed. Please check the token and the secret.');
        } else if (error.code === 'ERR_JWS_INVALID') {
            console.log('The JWT token is invalid. Please check the token and the secret.');
        }
        return { is_valid: false, msg: "Token is invalid" };
    }
}


async function authMiddleware(req, res, next)
{
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    const { is_valid, msg, user } = await verifyToken(token);
    if (!is_valid) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    next();
}

export default authMiddleware;