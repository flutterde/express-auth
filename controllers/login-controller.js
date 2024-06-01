

async function loginController(req, res)
{
    const email = req.body.email;
    const password = req.body.password;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(201);
    // wait for 5 second
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    });
    return res.json({ email, password });
}

export default loginController;