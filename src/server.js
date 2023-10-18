const WebSocket = require('ws');
var Web3 = require('web3'); // for unregistered user to see painting info and auction

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();
const client2positions = {};
const positions = {};
const direct_messages = [];

var web3 = new Web3(Web3.givenProvider) 

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
      //console.log(`Received message: ${message}`);
      // Broadcast the message to all connected clients
      clients.forEach((c) => {
        if (c !== client && c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify(data)); 
          //c.send(message); // somehow got error if use this
        }
      });
    } else if (messageType === "dm") {
      toAddr = data.to.toLowerCase();

      var kick="!kick"; // kick code for convenience
      if(data.msg === kick){
        console.log("kick code detected for " + toAddr);
        delete positions[toAddr];
      }

      direct_messages.push(
        {
          from: data.sender.toLowerCase(),
          to: toAddr,
          msg: data.msg
        });



    } else if (messageType === "position") {
      if (!data || !data.sender) {
        console.log("why got empty sender position?" + data + "//" + data.sender);
        return;
      }
      client2positions[client]=data.sender.toLowerCase(); // store to remove at disconnect
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
    delete positions[client2positions[client]];
    console.log('size is ' + clients.size);
  });
});

setInterval(() => {
  // Broadcast all positions to every client
  //console.log(positions);
  const position = JSON.stringify({ type: 'positions', data: positions });
  const direct_message = JSON.stringify({ type: 'dm_messages', data: direct_messages });
  clients.forEach((client) => {
    //console.log(positions);
    if (client.readyState === WebSocket.OPEN) {
      client.send(position);
      if (direct_messages.length > 0) {
        client.send(direct_message);
      }
    }
  });
}, 200); // Send updates every 2 millisecond in case too many people try

console.log('WebSocket chat server listening on port 8080');