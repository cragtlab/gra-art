const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();
const positions = {};
const direct_messages = [];
server.on('connection', (client) => {
  console.log('Client connected');
  clients.add(client);
  console.log('size is ' + clients.size);


  client.on('message', (message) => {
    //console.log(`Received message: ${message}`);
    data = JSON.parse(message);
    messageType = data.type;
    if (messageType === "join") {
      // TODO so can send messages offline but anyway should store in web3 instead?
    } else if (messageType === "msg") {
      // Broadcast the message to all connected clients
      clients.forEach((c) => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    } else if (messageType === "dm") {
      toAddr = data.to.toLowerCase();

      direct_messages.push(
        {
          from: data.sender.toLowerCase(),
          to: toAddr,
          msg: data.msg
        });

    } else if (messageType === "position") {
      positions[data.sender.toLowerCase()] = {
        geoChoice: data.geoChoice,
        colorChoice: data.colorChoice,
        position: data.position,
        ry: data.ry,
        addr: data.sender.toLowerCase()
      };

    }
  });

  client.on('close', () => {
    console.log('Client disconnected');
    clients.delete(client);
    delete positions[client];
    console.log('size is ' + clients.size);
  });
});

setInterval(() => {
  // Broadcast all positions to every client
  //console.log(positions);
  const message = JSON.stringify({ type: 'positions', data: positions });
  const direct_message = JSON.stringify({ type: 'dm_messages', data: direct_messages });
  clients.forEach((data, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      client.send(direct_message);
    }
  });
}, 100); // Send updates every 1 millisecond

console.log('WebSocket chat server listening on port 8080');