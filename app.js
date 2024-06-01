import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';

dotenv.config();
const port = process.env.APP_PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello World from Root!')
});


app.listen(port);