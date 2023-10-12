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
let contractJSON, contract, paintingAddress;
let web3Paintings, web3Names;
async function clickConnect() {
    web3 = new Web3(window.ethereum);
    web3.eth.requestAccounts(); // for edge to work else accounts.length 0?
    accounts = await web3.eth.getAccounts();
    networkId = await web3.eth.net.getId();
    contractJSON = await fetchJSON("/src/abis/Painting.json");
    paintingAddress = contractJSON.networks[networkId].address;
    contract = await new web3.eth.Contract(contractJSON.abi, paintingAddress);

    refreshData();
}
function changeName() {
    addName();
}

async function refreshData() {
    web3Paintings = await contract.methods.getPaintings().call()
    web3Names = await getNames(); // store array into names[wallet_address] map
    console.log(web3Paintings);
    console.log(web3Names);

    // for index.html only, not index2.html
    if (typeof (loadAuctionPainting) != 'undefined') {
        connectBtn.textContent = getNiceName(accounts[0]);
        changeNameBtn.style.display = '';
        loadAuctionPainting(await getAuctionPaintingID());
    }
}

function getNiceName(walletAddress) {
    for (lookup of web3Names) {
        if (lookup.wallet_address.toLowerCase() === walletAddress.toLowerCase()) {
            return lookup.name;
        }
    }
    return walletAddress.substring(0, 5) + "..";
}
async function getNames() {
    return await contract.methods.getNames().call();
}
async function addName(name) {
    name = prompt("Choose Your Name");
    if (name) {
        await contract.methods.addName(accounts[0], name).send({ from: accounts[0] });
    }
}

async function getAuctionPaintingID() {
    return contract.methods.getAuctionPaintingID().call();
}
async function getAuctionExpiryDate() {
    return contract.methods.getAuctionExpiryDate().call();
}
async function getBids() {
    return contract.methods.getBids().call();
}
async function getAuctionDetails() {
    id = await getAuctionPaintingID();
    time = await getAuctionExpiryDate();
    bids = await getBids();
    return [id, time, bids];
}
async function addBid(amount) {
    contract.methods.addBid(amount).send({ from: accounts[0] });
}
async function payAuction() {
    bids = await contract.methods.getBids().call();
    contract.methods.payAuction().send({ from: accounts[0], value: bids[bids.length - 1].amount });
}


async function mintPainting(id) {
    try {
        await contract.methods.mint(id).send({ from: accounts[0], value: '1000000000000000' }) // 0.001
        refreshData();// to update ownership
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function listPainting(id, list_price) {
    try {
        //price=web3.utils.toWei(list_price, 'ether');
        await contract.methods.listToken(id, list_price).send({ from: accounts[0] })
        refreshData(); // to update 
    } catch (ex) {
        window.alert("Error Listing Painting");
    }
}
async function buyPainting(id) {
    try {
        await contract.methods.buyToken(id).send({ from: accounts[0], value: web3Paintings[id - 1].list_price }) // 0.001
        refreshData(); // to update painting
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function getPainting(id) {
    return web3Paintings[id];
}
setTimeout(() => { clickConnect(); }, 5000); // connect at start after things loadup?
