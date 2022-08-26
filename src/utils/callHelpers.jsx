import CardEntity from '../entities/card.entity'
import BigNumber from 'bignumber.js';
import { setTimes } from '../redux/battle/battle.slice';

const infinity = "100000000000000000000";

export const getBalance = async (tokenContract, address) => {
    return await tokenContract.methods.balanceOf(address).call()
}

export const getCharacter = async (contract, tokenID) => {
    return await contract.methods.characters(tokenID).call()
}

export const getContract = (web3, abi, address) => {
    if (web3 === null) return null
    return new web3.eth.Contract(abi, address)
}

export const getMaxPlay = async (contract) => {
    return contract.methods.MAX_PLAY_PER_DAY().call()
}

export const getYukiment = async (contract, account) => {
    const res = await contract.methods.walletOfOwnerWithCount(account).call()
    console.log("result:", res)
    return res
}

export const enterGame = async (contract, contractAddr, tokContract, nftContract, account, tokenID, bet, playerCard, setLoading, setOpponentCard, setBetFlag, setBetting, setSkipTimes, setBoostTimes, setPlayerCard, dispatch) => {
    try {
        const allowance = await tokContract.methods.allowance(account, contractAddr).call()
        if (allowance < bet) {
            await tokContract.methods.approve(contractAddr, infinity).send({
                from: account
            })
        }
        await contract.methods.enterGame(tokenID, new BigNumber(bet).times(10 ** 18).toString(), Math.floor(Math.random() * 100000000)).send({
            from: account
        })
        let res = await getPlayerInfo(contract, account)

        setSkipTimes(res.skipChance)
        setBoostTimes(res.boostChance)
        res = await getCharacter(contract, tokenID)
        const [element, power] = await getTraits(nftContract, res.enemyID)
        const times = res.playedTimes
        const max = await getMaxPlay(contract)
        dispatch(setTimes(max - times))
        setPlayerCard(new CardEntity({ tokenId: playerCard.tokenId, name: playerCard.name, times: max - times, image: playerCard.image, power: playerCard.power, element: playerCard.element }))
        setOpponentCard(new CardEntity({ tokenId: res.enemyID, name: `Yukiment ${res.enemyID}`, times: 0, image: './assets/monsters/yukiment-wind.png', power: power, element: element }))
        setBetFlag(true)
        setBetting(false)
        setLoading(false)
    } catch (e) {
        console.log("err:", e)
        setLoading(false)
        setBetFlag(false)
        setBetting(false)
    }
}


export const startFight = async (contract, tokContract, nftContract, account, tokenID, times, setFighting, setPlayerCard, setOpponentCard, setBetFlag, setBetting) => {
    try {
        const _balance = await tokContract.methods.balanceOf(account).call()
        await contract.methods.startFight(tokenID).send({
            from: account
        })
        const balance = await tokContract.methods.balanceOf(account).call()
        if (new BigNumber(_balance.toString()).lt(new BigNumber(balance.toString()))) {
            alert("You win")
        } else {
            alert("You Lose")
        }
        const [element, power] = await getTraits(nftContract, tokenID)
        setPlayerCard(new CardEntity({ tokenId: tokenID, name: `Yukiment ${tokenID}`, times: times, image: './assets/monsters/yukiment-wind.png', power: power, element: element }))
    } catch (e) {
        console.log("error:", e)
    }
    setOpponentCard(new CardEntity())
    setBetFlag(false)
    setBetting(false)
    setFighting(false)
}


export const claimReward = async (contract, account) => {
    await contract.methods.claimReward(account).send({
        from: account
    })
}

export const getWinningChance = async (contract, tokenID) => {
    return await contract.methods.calcWinPercent(tokenID).call()
}

export const getTraits = async (contract, tokenID) => {
    return await contract.methods.getTraitByID(tokenID).call()
}

export const getTokenURI = async (contract, tokenID) => {
    return await contract.methods.tokenURI(tokenID).call()
}

export const getPlayerInfo = async (contract, account) => {
    return await contract.methods.players(account).call()
}

export const skipEnemy = async (contract, nftContract, tokenID, account, setSkipTimes, setWinningChance, setLoading, setOpponentCard) => {
    try {
        const res = await getPlayerInfo(contract, account)
        if (res.skipChance > 0) {
            await contract.methods.skipEnemy(tokenID).send({
                from: account
            });
            const character = await getCharacter(contract, tokenID)
            const [element, power] = await getTraits(nftContract, character.enemyID)
            setOpponentCard(new CardEntity({ tokenId: character.enemyID, name: `Yukiment ${character.enemyID}`, image: './assets/monsters/yukiment-wind.png', power: power, element: element }))
            const chance = await getWinningChance(contract, tokenID)
            setWinningChance(chance)
            setSkipTimes(res.skipChance - 1)
            setLoading(false)
        } else {
            alert("Please buy more skip on shop")
            setLoading(false)
        }
    } catch (err) {
        console.log("error:", err)
        setLoading(false)
    }
}

export const boostPlayer = async (contract, tokenID, account, setBoostTimes, playerCard, setPlayerCard) => {
    try {
        const character = await getCharacter(contract, tokenID)
        if (character.isBoosted === true) {
            alert("A potion is already in use")
        } else {
            const res = await getPlayerInfo(contract, account)
            if (res.boostChance > 0) {
                await contract.methods.boostPlayer(tokenID).send({
                    from: account
                })
                setBoostTimes(res.boostChance - 1)
                const power = parseInt(playerCard.power * 1.1);
                setPlayerCard(new CardEntity({ tokenId: playerCard.tokenID, name: playerCard.name, times: playerCard.times, image: playerCard.image, power: power, element: playerCard.element }))
            } else {
                alert("Please buy more boost")
            }
        }
    } catch (err) {
        console.log("error:", err)
    }
}

export const buyItem = async (contract, tokContract, account, type) => {
    let cost = 0;
    if (type === 0) cost = await contract.methods.SKIP_COST().call()
    else cost = await contract.methods.BOOST_COST().call()
    const balance = tokContract.methods.balanceOf(account).call()
    if (balance < cost) {
        alert("You don't have enough Yuki token to buy Item.")
        return
    } else {
        const res = await getPlayerInfo(contract, account)
        if (Math.floor(Date.now() / 1000) - res.skippedTime < 86400 && type === 0) {
            alert("Time not reached.")
            return
        } else if (Math.floor(Date.now() / 1000) - res.boostedTime < 86400 && type === 1) {
            alert("Time not reached.")
        }
        else {
            await contract.methods.buyItem(type).send({
                from: account
            })
        }
    }
}