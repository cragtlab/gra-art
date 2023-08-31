const Land = artifacts.require("Land")

module.exports = async function (deployer) {
    const NAME = 'GRA Art Gallery Test'
    const SYMBOL = 'GRA'
    const COST = web3.utils.toWei('1', 'ether')

    await deployer.deploy(Land, NAME, SYMBOL, COST)
}
