import dbConnect from "../utils/db-connector.js";


async function postsController(req, res)
{
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    try{
        const client = await dbConnect.connect();
        const result = await client.query('SELECT * FROM tests');
        client.release();
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Errorrrrrrrrrrrr:: ", error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

export default postsController;