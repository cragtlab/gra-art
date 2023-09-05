async function fetchJSON(jsonFilePath) {
    return await fetch(jsonFilePath)
        .then((response) => response.json())
        .then((contractJSON) => {
            return contractJSON;
        })
        .catch((error) => {
            console.error('Error loading JSON:', error);
        });
}
let web3, accounts, networkId;
let contractJSON, contract, web3Paintings;
let paintingAddress;
async function clickConnect() {
    web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts(); // for edge to work else accounts.length 0?
    accounts = await web3.eth.getAccounts();
    networkId = await web3.eth.net.getId();
    contractJSON = await fetchJSON("/src/abis/Painting.json");
    //console.log(landJSON);
    paintingAddress= contractJSON.networks[networkId].address;
    contract = await new web3.eth.Contract(contractJSON.abi, paintingAddress);
    //console.log(land);
    //const cost = await land.methods.cost().call()
    //console.log(cost);
    web3Paintings = await contract.methods.getPaintings().call()
    console.log(web3Paintings);

    connectBtn.textContent = accounts[0];
    /*
        accounts = await ethereum.request({method: 'eth_requestAccounts' });
                const connectedAccount = accounts[0];
                // You can now use connectedAccount for interactions with the Ethereum blockchain
                console.log('Connected to wallet with address:', connectedAccount);
    */
}
async function mintPainting(id) {
    try {
        await contract.methods.mint(id).send({ from: accounts[0], value: '1000000000000000' }) // 0.001
        clickConnect(); // to update ownership
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function listPainting(id, list_price) {
    try {
        await contract.methods.listToken(id, list_price).send({ from: accounts[0] }) 
        clickConnect(); // to update 
    } catch (ex) {
        window.alert("Error Listing Painting");
    }
}
async function buyPainting(id) {
    try {        
        await contract.methods.buyToken(id).send({ from: accounts[0], value:  web3Paintings[id-1].list_price }) // 0.001
        clickConnect(); // to update painting
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function getPainting(id) {
    return web3Paintings[id];
}
clickConnect(); // connect at start

const socket = new WebSocket('ws://localhost:8080');
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
    if (!accounts) {
        clickConnect();
        return;
    }
    if(accounts.length == 0){
        alert("No Address? Connect first!");
        return;
    }
    message = JSON.parse(event.data);
    //console.log("received message " + message);
    if (message.type === "msg") {
        if (message.sender === accounts[0]) {
            //  console.log('ignore msg from self');
        } else {
            addMessage(message.sender, message.msg);
        }
    } else if (message.type === "positions") {
        // update positions        
        //console.log("received positions");
        playerPositions = [];
        for (key in message.data) {
            if (key === accounts[0]) {
                // ignore self
            } else {
                playerPositions.push({
                    geoChoice: message.data[key].geoChoice,
                    colorChoice: message.data[key].colorChoice,
                    position: message.data[key].position
                }
                )
            }
        }
        //console.log(playerPositions);        
    }
});

socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
    clearInterval(sendPosInterval);
});

function sendMessage(msg) {
    socket.send(JSON.stringify({ type: 'msg', sender: accounts[0], msg: msg }));
}
function sendMyPosition() {
    if(!character || !accounts){
        return;
    }
    //console.log("send pos:"+geoChoice+","+colorChoice+","+character.position)
    socket.send(JSON.stringify({
        type: 'position', sender: accounts[0],
        geoChoice: geoChoice, colorChoice: colorChoice, position: character.position
    }));

}
sendPosInterval=setInterval(function () { sendMyPosition() }, 100);
setInterval(function () { renderPlayerPositions() }, 100);


// old code
/*
if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum)
    const accounts = await web3.eth.getAccounts()

    const networkId = await web3.eth.net.getId()
    const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address)
    setLandContract(land)

    const cost = await land.methods.cost().call()
    setCost(web3.utils.fromWei(cost.toString(), 'ether'))

    const buildings = await land.methods.getBuildings().call()
    setBuildings(buildings)

    // Event listeners...
    window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0])
    })

    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    })
}*/