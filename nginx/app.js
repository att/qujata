const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.send('Received POST request.\n'); 
});
app.post('/', function (req, res) {
    res.send('Received GET request.');  
  });
app.listen(3000, function () {
  console.log('app listening on port 3000');
});