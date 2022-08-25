import CardEntity from '../entities/card.entity'

import arenaBattleABI from '../consts/arenaBattle.json';
import yukiTokenABI from '../consts/yukiTokenABI.json';
import yukiNftABI from '../consts/yukimentNftABI.json';
const arenaBattleAddr = '0xCd881dDf3A7FE624a1260925f786Fc87f3c73d1b';
const yukiTokenAddr = '0x3C574c8b56B2E5E3B674Ac595E31F08a425Ae3c9';
const yukiNftAddr = '0xdf3A9D18a8ad4dAF5c37AD2B864e6ebDa7f964e1';

const eventTypes = {

}

export const getBalance = async (tokenContract, address) => {
    return await tokenContract.methods.balanceOf(address).call()
}

export const getContract = (web3, abi, address) => {
    if (web3 === null) return null
    return new web3.eth.Contract(abi, address)
}

export const getYukiment = async (contract, account) => {
    return await contract.methods.walletOfOwner(account).call()
}

export const payForSkip = async (contract, account) => {
    return await contract.methods.payForSkip(account).send({
        from: account
    })
}

export const chooseEnemy = async (contract, nftContract, account, tokenID, betFlag, setLoading, setOpponentCard) => {
    if (!betFlag) {
        console.log("bet failed before chooseEnemy")
        return;
    }
    try {
        await setLoading(true);
        console.log(contract)
        const enemySelectedEvent = contract.events.EnemySelected()
        console.log("enemySelectedEvent:", enemySelectedEvent)
        enemySelectedEvent.on('data', async function (event) {
            const res = event.returnValues;
            console.log(res._id, tokenID, res._from, account)
            if (res._id === tokenID && res._from.toLowerCase() === account.toLowerCase()) {
                const [element, power] = await getTraits(nftContract, res._eid)
                setOpponentCard(new CardEntity({ tokenId: res._eid, name: `Yukiment ${res._eid}`, image: './assets/monsters/yukiment-wind.png', power: power, element: element }))
            }
            setLoading(false)
        });
        await contract.methods.startChooseEnemy(tokenID).send({
            from: account
        })
    } catch (e) {
        console.log("error:", e)
        setLoading(false)
    }
}

export const enterGame = async (contract, contractAddr, tokContract, account, tokenID, web3, bet, setBetting, setBetFlag) => {
    try {
        const battleEndedEvent = contract.events.BattleEnded()
        console.log("battleEndedEvent:", battleEndedEvent);
        battleEndedEvent.on('data', async function (event) {
            const res = event.returnValues;
            console.log(res);
            if (res._id === tokenID && res._from.toLowerCase() === account.toLowerCase()) {
                const isWin = res.result ? "You win" : "You lose"
                alert(isWin)
                setBetting(false)
                setBetFlag(true)
            }
        });
        const allowance = await tokContract.methods.allowance(account, contractAddr).call()
        console.log("allowance:", allowance)
        console.log("bet:      ", bet)
        if (allowance < bet) {
            await tokContract.methods.approve(contractAddr, "1000000000000000000000").send({
                from: account
            })
        }
        const whoOwnThisToken = async (tokenId) => {
            const contract = new web3.eth.Contract(yukiNftABI, yukiNftAddr);
            // Don't forget to use await and .call()
            console.log("yukiNft contract:", contract)
            const owner = await contract.methods.ownerOf(tokenId).call();
            console.log("owner of tokenID: ", owner);
        }
        whoOwnThisToken(tokenID);

        console.log("allowance:", allowance)
        console.log("bet:      ", bet)
        try{
            console.log("tokenID:", tokenID);
            console.log("contract:", contract);
            console.log("tokContract:", tokContract);
            console.log("")
            await contract.methods.enterGame(tokenID, bet).send({
                from: account
            })

        } catch (er) {
            console.log("er:", er)
        }
    } catch (e) {
        console.log("error:", e)
        setBetting(false);
    }
}


export const startFight = async (contract, contractAddr, tokContract, account, tokenID, setFighting) => {
    try {
        const battleEndedEvent = contract.events.BattleEnded()
        battleEndedEvent.on('data', async function (event) {
            const res = event.returnValues;
            if (res._id === tokenID && res._from.toLowerCase() === account.toLowerCase()) {
                const isWin = res.result ? "You win" : "You lose"
                alert(isWin)
                setFighting(false)
            }
        });
        await contract.methods.startFight(tokenID).send({
            from: account
        })
    } catch (e) {
        console.log("error:", e)
        setFighting(false);
    }
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