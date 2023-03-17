const express = require('express');
const http = require('http');

const app = express();

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/products',
  method: 'GET'
};

const concurrency = 10;
const totalRequests = 100;

let completedRequests = 0;
let failedRequests = 0;

app.get('/stress-test', (req, res) => {
  let requestCounter = 0;
  while (requestCounter < totalRequests) {
    for (let i = 0; i < concurrency && requestCounter < totalRequests; i++) {
      const req = http.request(options, (response) => {
        response.on('data', (data) => {});
        response.on('end', () => {
          completedRequests++;
          console.log(`Completed request ${completedRequests}`);
          if (completedRequests + failedRequests === totalRequests) {
            console.log(`Completed ${completedRequests} requests, ${failedRequests} requests failed`);
            res.send(`Completed ${completedRequests} requests, ${failedRequests} requests failed`);
          }
        });
      });

      req.on('error', (err) => {
        failedRequests++;
        console.error(err);
        if (completedRequests + failedRequests === totalRequests) {
          console.log(`Completed ${completedRequests} requests, ${failedRequests} requests failed`);
          res.send(`Completed ${completedRequests} requests, ${failedRequests} requests failed`);
        }
      });

      req.end();
      requestCounter++;
    }
  }
});

app.listen(3005, () => {
  console.log('App listening on port 3005!');
});
