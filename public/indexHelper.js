
const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
    if (!accounts) {
        clickConnect();
        return;
    }
    if (accounts.length == 0) {
        alert("No Address? Connect first!");
        return;
    }
    //console.log("received message: ");
    //console.log(event);
    message = JSON.parse(event.data);
    //console.log("received message " + message);
    if (message.type === "msg") {
        if (message.sender === (accounts[0].toLowerCase())) {
            console.log('ignore msg from self');
        } else {
            addMessage(message.sender, message.msg);
        }
    } else if (message.type === "positions") {
        // update positions        
        //console.log("received positions");
        playerPositions = [];
        for (key in message.data) {
            if (key === accounts[0].toLowerCase()) {
                // ignore selfd")
            } else {
                playerPositions.push({
                    geoChoice: message.data[key].geoChoice,
                    colorChoice: message.data[key].colorChoice,
                    position: message.data[key].position,
                    ry: message.data[key].ry,
                    addr: message.data[key].addr
                }
                )
            }
        }
    } else if (message.type === "dm_messages") {
        if (!accounts[0]) { 
            return; 
        }
        //console.log("processing dm wih "+ accounts[0]);
        if (direct_messages.length != message.data.length) {
            i = direct_messages.length; // get first before set
            direct_messages = message.data; // set first then will display
            for (i; i < message.data.length; i++) {
                msg = message.data[i];
                //console.log("process new DM: ");
                //console.log(msg);

                if (msg.to === accounts[0].toLowerCase()){
                    showTab(msg.from);
                }else if(msg.from === accounts[0].toLowerCase()) {
                    showTab(msg.to);
                }
            }

        }
    }

    //console.log(playerPositions);        
});

socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
    clearInterval(sendPosInterval);
});

function sendMessage(msg) {
    //console.log(toAddr+ " //// "+msg); 
    if (toAddr) {
        socket.send(JSON.stringify({ type: 'dm', sender: accounts[0], to: toAddr, msg: msg }));
    } else {
        socket.send(JSON.stringify({ type: 'msg', sender: accounts[0], msg: msg }));
    }
}
function sendMyPosition() {
    if (!character || !accounts) {
        return;
    }
    //console.log("send pos:"+geoChoice+","+colorChoice+","+character.position+","+character.rotation.y)
    socket.send(JSON.stringify({
        type: 'position', sender: accounts[0],
        geoChoice: geoChoice, colorChoice: colorChoice, position: character.position, ry: character.rotation.y
    }));
}
sendPosInterval = setInterval(function () { sendMyPosition() }, 100);
setInterval(function () { renderPlayerPositions() }, 100);
setInterval(function () { showWhoIsOnline() }, 5000);
