const http = require("http");
const { PORT, HOSTNAME } = require("./config/config");
const { serverRun } = require("./helpers/logs.helper");
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
});

server.listen(PORT, HOSTNAME, () => serverRun(PORT));
