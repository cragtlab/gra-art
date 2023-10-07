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
    paintingAddress = contractJSON.networks[networkId].address;
    contract = await new web3.eth.Contract(contractJSON.abi, paintingAddress);

    web3Paintings = await contract.methods.getPaintings().call()
    console.log(web3Paintings);

    // for index.html only, not index2.html
    if (typeof(loadAuctionPainting) != 'undefined') {
        loadAuctionPainting(await getAuctionPaintingID());
        connectBtn.textContent = accounts[0];
    }
    /*
        accounts = await ethereum.request({method: 'eth_requestAccounts' });
                const connectedAccount = accounts[0];
                // You can now use connectedAccount for interactions with the Ethereum blockchain
                console.log('Connected to wallet with address:', connectedAccount);
    */
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
        clickConnect(); // to update ownership
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function listPainting(id, list_price) {
    try {
        //price=web3.utils.toWei(list_price, 'ether');
        await contract.methods.listToken(id, list_price).send({ from: accounts[0] })
        clickConnect(); // to update 
    } catch (ex) {
        window.alert("Error Listing Painting");
    }
}
async function buyPainting(id) {
    try {
        await contract.methods.buyToken(id).send({ from: accounts[0], value: web3Paintings[id - 1].list_price }) // 0.001
        clickConnect(); // to update painting
    } catch (ex) {
        window.alert("Error Buying Painting");
    }
}
async function getPainting(id) {
    return web3Paintings[id];
}
clickConnect(); // connect at start
