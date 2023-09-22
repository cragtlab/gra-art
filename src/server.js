const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();
const positions = {};
server.on('connection', (client) => {
  console.log('Client connected');
  clients.add(client);  
  console.log('size is '+clients.size);

  client.on('message', (message) => {
    //console.log(`Received message: ${message}`);
    data=JSON.parse(message);
    messageType=data.type;
    if(messageType==="msg"){    
      // Broadcast the message to all connected clients
      clients.forEach((c) => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    }else if(messageType==="position"){
      positions[data.sender.toLowerCase()]={
        geoChoice: data.geoChoice,
        colorChoice: data.colorChoice,
        position: data.position
      };
    }
  });

  client.on('close', () => {
    console.log('Client disconnected');
    clients.delete(client);
    delete positions[client];
    console.log('size is '+clients.size);
  });
});

setInterval(() => {
  // Broadcast all positions to every client
  //console.log(positions);
  const message = JSON.stringify({ type: 'positions', data: positions });
  clients.forEach((data, client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 100); // Send updates every 1 millisecond


console.log('WebSocket chat server listening on port 8080');