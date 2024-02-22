import express from "express";
import ejs from "ejs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 7777;

app.use("/", express.static("./node_modules/bootstrap/dist/"));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get("/", async (req, res) => {
    res.render("Dashboard");
});
app.get("/G", async (req, res) => {
    res.render("G");
});
app.get("/G2", async (req, res) => {
    res.render("G2");
});
app.get("/Login", async (req, res) => {
    res.render("Login");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
