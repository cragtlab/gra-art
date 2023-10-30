
let socket;
connect();

function connect() {
    socket = new WebSocket('ws://' + location.hostname + ':8080');

    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server');
    });
    /*socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.log('Attempting to reconnect in 5s...');
        setTimeout(() => {
            connecting = false
            connect();
        }, 5000);
    };*/
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
            if(!accounts && !unregistered_name){
                // ignore until got name or account at start                
                return;
            }
            if (direct_messages.length != message.data.length) {
                let i = direct_messages.length; // get first before set. also be careful i affected by showtab
                direct_messages = message.data; // set first then will display
                for (; i < message.data.length; i++) {
                    msg = message.data[i];
                    
                    //console.log("process new DM: ");
                    //console.log(msg);
                    //console.log(isMe(msg.to) || isMe(msg.from));
                    
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

    socket.addEventListener('close', (event) => {
        console.log('Disconnected from WebSocket server will reconnect');
        console.log('Attempting to reconnect in 5s...');
        //clearInterval(sendPosInterval);
        setTimeout(() => {
            connect();
        }, 5000);
    });


}
let unregistered_name;
function tryUnregisteredName(takenName) {
    if (takenName) {
        unregistered_name = prompt(takenName + ' is taken. Try another name please!', takenName);
    } else {
        console.log('why prompt this?');
        unregistered_name = prompt('Enter Name');
    }
    if (unregistered_name) {
        unregistered_name = unregistered_name.toLowerCase();
        found = false;
        for (p of playerPositions) {
            if (p.addr === unregistered_name.toLowerCase()) {
                found = true;
                break;
            }
        }

        if (!found) {
            loaded = true;
            explorerBtn.disabled = 'disabled';
        } else {
            tryUnregisteredName(unregistered_name); // prompt again that name taken
        }
    }
}


// return true if got accounts[0] is me or is unregistered_name 
function isMe(address) {
    //console.log(address+" isME? " + accounts + " // " + unregistered_name)    
    if (accounts && accounts.length > 0) {
        return address === accounts[0].toLowerCase();
    }

    if (unregistered_name) {
        return address === unregistered_name.toLowerCase();
    }

    return false;
}
function sendMessage(msg) {
    //console.log(toAddr+ " //// "+msg); 
    if (!accounts) {
        if (!unregistered_name) {
            tryUnregisteredName();
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
    // avatar not selected yet
    if(geoChoice < 0){
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




}
sendPosInterval = setInterval(function () { sendMyPosition() }, 100);
setInterval(function () { renderPlayerPositions() }, 100);
setInterval(function () {
    showWhoIsOnline();
    refreshData(); // so auction updated?
    // getNames() 
}, 15000);
