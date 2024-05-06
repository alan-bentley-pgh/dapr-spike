import express from 'express';
import { DaprClient, HttpMethod, CommunicationProtocolEnum } from 'dapr-client';

const app = express();
const port = 3002;
const daprHost = '127.0.0.1';
const daprPort = 3500;

// app.get('/fetch-message', async (req, res) => {
//     try {
//       // Call Dapr service invocation API to invoke your service
//       const result = await fetch(`http://localhost:3500/v1.0/invoke/hello-world-server/method/message`);
  
//       const payload = await result.json();
//       console.log(`result: ${JSON.stringify(payload)}`);
  
//       res.send(payload);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
// });

app.get('/fetch-message', async (req, res) => {
    const serverAppId = 'hello-world-server';
    try {
        // Call Dapr service invocation API to invoke your service
        const daprClient = new DaprClient(daprHost, daprPort, CommunicationProtocolEnum.HTTP);
        const result = await daprClient.invoker.invoke(serverAppId, 'api/v1/message', HttpMethod.GET);
        console.log(`result: ${JSON.stringify(result)}`);

        const responseDto = {
            message: result.message,
            originAppId: serverAppId,
        };

        res.send(responseDto);

    } catch (error) {
      res.status(500).send(error.message);
    }
});

// start express app
app.listen(port, () => {
  console.log('Express server listening on port '+port);
});
