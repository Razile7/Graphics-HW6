import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

const app = express()
const port = 8000

// Serve static files
app.use("/src", express.static(__dirname + "/src"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/lib", express.static(__dirname + "/lib"));
app.use("/screenshots", express.static(__dirname + "/screenshots"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
  })

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})  