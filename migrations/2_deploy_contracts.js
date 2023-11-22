const Painting = artifacts.require("Painting")
const VIPNFT = artifacts.require("VIPNFT")
module.exports = async function (deployer) {
    const NAME = 'GRA Art Gallery Test'
    const SYMBOL = 'GRA'
    const COST = web3.utils.toWei('1', 'ether')

    await deployer.deploy(VIPNFT)
    await deployer.deploy(Painting, NAME, SYMBOL, COST) // must await cause get too many requests from rpc?
   
}
