
let socket;
let connecting = false;
connect();

function connect() {
    if (!connecting)
        socket = new WebSocket('ws://' + location.hostname + ':8080');

    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
        connecting = false;
    });
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('Attempting to reconnect in 5s...');
        setTimeout(() => {
            connecting=false
            connect();
        }, 5000);

    };
    socket.addEventListener('message', (event) => {
        //console.log("event.data is");
        //console.log(event.data);
        message = JSON.parse(event.data);

        if (message.type === "msg") {
            //console.log("received message ");
            //console.log(message);
            if (isMe(message.sender)) {
                console.log('ignore msg from self');
            } else {
                addMessage(message.sender, message.msg);
            }
        } else if (message.type === "positions") {
            // update positions        
            //console.log("received positions");
            playerPositions = [];
            for (key in message.data) {
                if (isMe(key)) {
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
            //console.log("processing dm wih "+ accounts[0]);
            if (direct_messages.length != message.data.length) {
                i = direct_messages.length; // get first before set
                direct_messages = message.data; // set first then will display
                for (i; i < message.data.length; i++) {
                    msg = message.data[i];
                    //console.log("process new DM: ");
                    //console.log(msg);

                    if (isMe(msg.to)) {
                        showTab(msg.from);
                    } else if (isMe(msg.from)) {
                        showTab(msg.to);
                    }
                }

            }
        }

        //console.log(playerPositions);        
    });

}
let unregistered_name;
// return true if got accounts[0] is me or is unregistered_name 
function isMe(address) {
    if (accounts && accounts.length > 0) {
        return address === accounts[0].toLowerCase();
    }

    if (unregistered_name) {
        return address === unregistered_name;
    }

    return false;
}
function sendMessage(msg) {
    //console.log(toAddr+ " //// "+msg); 
    if (!accounts) {
        if (!unregistered_name) {
            unregistered_name = prompt("Choose your name (Note you need to connect wallet to particpate in auction");
            loaded=true; // load
            chatarea.innerHTML = "<b>System: </b> Note you need to connect wallet (top right) to particpate in auction<br/>" + chatarea.innerHTML;
            
            //unregistered_name += ""; // maybe add some random hash so will be unique rather than server do
        }
        if (unregistered_name) {
            if (toAddr) {
                socket.send(JSON.stringify({ type: 'dm', sender: unregistered_name, to: toAddr, msg: msg }));
            } else {
                socket.send(JSON.stringify({ type: 'msg', sender: unregistered_name, msg: msg }));
            }
        }
        return;
    }

    if (toAddr) {
        socket.send(JSON.stringify({ type: 'dm', sender: accounts[0], to: toAddr, msg: msg }));
    } else {
        socket.send(JSON.stringify({ type: 'msg', sender: accounts[0], msg: msg }));
    }
}
function sendMyPosition() {
    // send when character out and player connected (reg or unregistered)
    if (!character || (!accounts && !unregistered_name)) {
        return;
    }
    if (socket.readyState != WebSocket.OPEN) {
        //connect();
        return;
    }

    if (unregistered_name) {
        socket.send(JSON.stringify({
            type: 'position', sender: unregistered_name,
            geoChoice: geoChoice, colorChoice: colorChoice, position: character.position, ry: character.rotation.y
        }));
        return;
    }
    if (accounts.length > 0) {
        //console.log("send pos:"+geoChoice+","+colorChoice+","+character.position+","+character.rotation.y)
        socket.send(JSON.stringify({
            type: 'position', sender: accounts[0],
            geoChoice: geoChoice, colorChoice: colorChoice, position: character.position, ry: character.rotation.y
        }));
    } else {
        // somehow IE allow accounts.length 0
    }

    socket.addEventListener('close', (event) => {
        console.log('Disconnected from WebSocket server will reconnect');
        console.log('Attempting to reconnect in 5s...');
        //clearInterval(sendPosInterval);
        setTimeout(() => {
            connect();
        }, 5000);
    });



}
sendPosInterval = setInterval(function () { sendMyPosition() }, 100);
setInterval(function () { renderPlayerPositions() }, 100);
setInterval(function () {
    showWhoIsOnline();
    refreshData(); // so auction updated?
    // getNames() 
}, 15000);
