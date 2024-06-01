

async function registerController(req, res)
{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201);
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
    return res.json({ email, password, name });
}

export default registerController;