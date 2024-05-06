import express from 'express';
import { DaprClient, HttpMethod, CommunicationProtocolEnum } from 'dapr-client';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

const daprHost = '127.0.0.1';
const daprPort = 3500;
const stateStoreName = 'statestore';
const client = new DaprClient(daprHost, daprPort, CommunicationProtocolEnum.HTTP);

app.use(express.json());

// service invocation endpoint
app.get('/api/v1/message', (req, res) => {
  console.log(`now returing with message: Hello World!`);
  res.send({message: 'Hello World!'});
});

// state management endpoint
app.post('/api/v1/user', async (req, res) => { 
  const userDto = req.body;
  console.log(`now inserting user: ${JSON.stringify(userDto)}`);

  const userId = uuidv4();
  await client.state.save(stateStoreName, [{
    key: userId,
    value: JSON.stringify(userDto),
  }]);

  console.log(`user ${userId} saved to state store ${stateStoreName}`);
  res.send(userId);
});

app.get('/api/v1/user/:id', async (req, res) => { 
    const userId = req.params.id;
    console.log(`now fetching user: ${userId}`);

    const result = await client.state.get(stateStoreName, userId);
    if(!result) { 
      console.log(`user ${userId} not found`);
      return res.status(400).send({errorMessage: `user ${userId} not found`});
    }
    
    const userDto = JSON.parse(result);
    console.log(`userDto: ${JSON.stringify(userDto)}`);

    const responseDto = { 
      id: userId,
      name: userDto.name,
    };

    return res.send(responseDto);
});

// start express app
app.listen(port, () => {
  console.log('Express server listening on port '+port);
});
