import express from "express";
import http from "http";
const app = express();

app.use(express.static(`.`));
app.get(`/shutdown`, (_req,res) => {
    res.json({ ok: true });
    server.close(() => {
        process.exit(0);
    });
});

const server = http.createServer(app).listen(8000);
