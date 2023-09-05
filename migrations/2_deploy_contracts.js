const Painting = artifacts.require("Painting")

module.exports = async function (deployer) {
    const NAME = 'GRA Art Gallery Test'
    const SYMBOL = 'GRA'
    const COST = web3.utils.toWei('1', 'ether')

    await deployer.deploy(Painting, NAME, SYMBOL, COST)
}
