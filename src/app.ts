import express from 'express';

const app = express();
const host = process.env.SERVER_HOST || process.env.host;
const port = process.env.SERVER_PORT || 3001;
const env = process.env.NODE_ENV;

app.get(`/`, (_, res) => {
    res.send(process.env);
});

app.listen(port, () => {
    console.info(`${env} server up and running on ${host}:${port}`);
});
