import Ranks from "../models/ranksModel.js";

export const getGlobalRanks = async (req, res) => {
    const date = req.query.date

    const creationTimesArray = await Ranks.find().select('creationTime').distinct('creationTime')
    const theLatestTimestamp = date === 'Najnowsze' || !date ? creationTimesArray[creationTimesArray.length - 1] : new Date(date)

    const foundData = await Ranks.findOne({ creationTime: theLatestTimestamp })
    if (!foundData) return res.status(500).json({ msg: 'Nie znaleziono /ranks/ !' })
    console.log(foundData)
    
    const global = foundData.worlds.find(w => w.name === 'Wszystkie')

    const worlds = foundData.worlds.filter(w => w.name !== 'Wszystkie')
    console.log(worlds)
    worlds.sort((a, b) => {
        return b.nCharacters.n - a.nCharacters.n
    })


    return res.status(200).json({ global, worlds, creationTime: foundData.creationTime })
}

export const getWorldRanks = async (req, res) => {
    const world = req.params.world
    const date = req.query.date

    const creationTimesArray = await Ranks.find().select('creationTime').distinct('creationTime')
    const theLatestTimestamp = date === 'Najnowsze' || !date ? creationTimesArray[creationTimesArray.length - 1] : new Date(date)

    const foundData = await Ranks.findOne({ creationTime: theLatestTimestamp })
    if (!foundData) return res.status(500).json({ msg: 'Nie znaleziono /ranks/ !' })
    console.log(foundData)

    const selectedWorld = foundData.worlds.find(w => w.name === world)
    const worlds = foundData.worlds.map(w => {
        if (w.name !== 'Wszystkie') return w
    })
    const global = foundData.worlds.find(w => w.name === 'Wszystkie')

    const char_n = worlds.sort((a, b) => {
        return b.nCharacters.n - a.nCharacters.n
    })
    const nCharactersRank_n = char_n.findIndex(w => {
        return w.name === world
    }) + 1  

    const char_gainLast = worlds.sort((a, b) => {
        return b.nCharacters.gainFromLast - a.nCharacters.gainFromLast
    })
    const nCharactersRank_gainLast = char_gainLast.findIndex(w => {
        return w.name === world
    }) + 1

    const char_gainAvg = worlds.sort((a, b) => {
        return b.nCharacters.gainAvg - a.nCharacters.gainAvg
    })
    const nCharactersRank_gainAvg = char_gainAvg.findIndex(w => {
        return w.name === world
    }) + 1

    const world_lvl = worlds.sort((a, b) => {
        return b.maxLvl - a.maxLvl
    })

    const maxLvlRank = world_lvl.findIndex(w => {
        return w.name === world
    }) + 1

    console.log(`nCharactersRank_n: ${nCharactersRank_n}`)
    console.log(`nCharactersRank_gainLast: ${ nCharactersRank_gainLast }`)
    console.log(`nCharactersRank_gainAvg: ${ nCharactersRank_gainAvg }`)
    return res.status(200).json({ global, worlds, maxLvlRank, creationTime: foundData.creationTime, selectedWorld, nCharactersRank_n, nCharactersRank_gainLast, nCharactersRank_gainAvg })
}

export const getDatesArray = async (req, res) => {
    const datesArray = await Ranks.find().select('creationTime').distinct('creationTime')
    if (!datesArray) return res.status(500).json({ msg: '!datesArray' })

    console.log(datesArray)
    return res.status(201).json({ datesArray: datesArray.reverse() })
}

