import express from 'express';

const app = express();

app.get('/api/v1/message', (req, res) => {
  console.log(`now returing with message: Hello World!`);
  res.send({message: 'Hello World!'});
});

const port = 3001;
// start express app
app.listen(port, () => {
  console.log('Express server listening on port '+port);
});
