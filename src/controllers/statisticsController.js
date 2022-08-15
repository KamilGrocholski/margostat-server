import Statistics from '../models/statisticsModel.js'

export const getTheMostRecentDataWithFilter = async (req, res) => {
    let min = parseInt(req.query.min) || 1
    let max = parseInt(req.query.max) || 500

    if (min > max) {
        min = 1
        max = 500
    }

    //pobieram tablicę dat utworzenia
    const creationTimesArray = await Statistics.find().select('creationTime').distinct('creationTime')
    console.log(creationTimeCheck)

    const foundData = await Statistics
        .aggregate([
            {
                $match: {
                    'creationTime': creationTimesArray[creationTimesArray.length - 1] //najnowsze
                }
            },
            {
                $project: {
                    filteredProfsByLvl: {
                        $filter: {
                            input: '$profsByLvl',
                            as: 'element',
                            cond: { 
                                $and: [
                                    {
                                        $gte: ['$$element.lvl', min]
                                    },
                                    {
                                        $lte: ['$$element.lvl', max]
                                    }
                                ]
                             }
                        }
                    },
                    _id: 0,
                    name: 1,
                    nCharacters: 1,
                    maxLvl: 1,
                    nW: 1,
                    nM: 1,
                    nP: 1,
                    nH: 1,
                    nT: 1,
                    nBd: 1,
                    creationTime: 1
                }
            }
        ])

        const calcEveryWorld = (profs) => {
            const profsData = [
                {
                    name: 'Wojownik',
                    q: 0,
                    p: 0
                },
                {
                    name: 'Mag',
                    q: 0,
                    p: 0
                },
                {
                    name: 'Paladyn',
                    q: 0,
                    p: 0
                },
                {
                    name: 'Tropiciel',
                    q: 0,
                    p: 0
                },
                {   
                    name: 'Łowca',
                    q: 0,
                    p: 0
                },
                {
                    name: 'Tancerz ostrzy',
                    q: 0,
                    p: 0
                }
            ]
        
            // console.log(foundData)
        
            profs.map((lvl) => {
                profsData[0].q += lvl.profs['Wojownik']
                profsData[1].q += lvl.profs['Mag']
                profsData[2].q += lvl.profs['Paladyn']
                profsData[3].q += lvl.profs['Tropiciel']
                profsData[4].q += lvl.profs['Łowca']
                profsData[5].q += lvl.profs['Tancerz ostrzy']
            })
        
            const totalCharsInRange = 
                profsData[0].q +
                profsData[1].q +
                profsData[2].q +
                profsData[3].q +
                profsData[4].q +
                profsData[5].q 
        
            profsData[0].p = (profsData[0].q / totalCharsInRange) * 100
            profsData[1].p = (profsData[1].q / totalCharsInRange) * 100
            profsData[2].p = (profsData[2].q / totalCharsInRange) * 100
            profsData[3].p = (profsData[3].q / totalCharsInRange) * 100
            profsData[4].p = (profsData[4].q / totalCharsInRange) * 100
            profsData[5].p = (profsData[5].q / totalCharsInRange) * 100
        
            // profsData.sort((a, b) => {
            //     return b.q - a.q
            // })

            return profsData
        }

        const calculatedEveryWorldData = []

    foundData.map(w => {
        const calculatedOneWorldData = calcEveryWorld(w.filteredProfsByLvl)
        calculatedEveryWorldData.push({
            name: w.name,
            maxLvl: w.maxLvl,
            nCharacters: w.nCharacters,
            profsByLvl: calculatedOneWorldData,
            nW: w.nW,
            nM: w.nM,
            nP: w.nP,
            nH: w.nH,
            nT: w.nT,
            nBd: w.nBd,
            creationTime: w.creationTIme
        })
    })

    console.log(calculatedEveryWorldData)

    console.log(foundData)
    return res.json(calculatedEveryWorldData)
}   

export const getTheMostRecentData = async (req, res) => {

    //pobieram tablicę dat utworzenia
    const creationTimesArray = await Statistics.find().select('creationTime').distinct('creationTime')

    const foundData = await Statistics
        .find({ creationTime: creationTimesArray[creationTimesArray.length - 1] })

    console.log(foundData)
    return res.json(foundData)
} 

export const getGlobalCharactersHistory = async (req, res) => {
    const result = await Statistics
        .find({ name: 'Wszystkie' })
        .sort('creationTime')
        .select('nCharacters maxLvl creationTime name nW nM nP nH nT nBd')
    console.log(result)
    return res.json(result)
}

export const getOneWorldByDate = async (req, res) => {
    const world = req.params.world
    const date = req.query.date

    //pobieram tablicę dat utworzenia
    const creationTimesArray = await Statistics.find().select('creationTime').distinct('creationTime')
    console.log(creationTimesArray)
    const timestamp = date === 'Najnowsze' || !date ? creationTimesArray[creationTimesArray.length - 1] : new Date(date)

    const foundData = await Statistics
        .findOne({ name: world, creationTime: timestamp })   

    if (!foundData) return res.status(500).json({ msg: 'Nie znaleziono danych.' })

    return res.status(200).json({
        name: foundData.name,
        nCharacters: foundData.nCharacters,
        profsByLvl: foundData.profsByLvl,
        maxLvl: foundData.maxLvl,
        nW: foundData.nW,
        nM: foundData.nM,
        nP: foundData.nP,
        nH: foundData.nH,
        nT: foundData.nT,
        nBd: foundData.nBd,
        creationTime: foundData.creationTime,
        creationTimesArray
    })
}

export const getOneWorldProfsFilteredByLvl = async (req, res) => {
    let min = parseInt(req.query.min) || 1
    let max = parseInt(req.query.max) || 500
    const world = req.params.world || 'Wszystkie'
    const date = req.query.date
    console.log(date)
    if (min > max) {
        min = 1
        max = 500
    }

    const creationTimesArray = await Statistics.find().select('creationTime').distinct('creationTime')
    const timestamp = date === 'Najnowsze' || !date ? creationTimesArray[creationTimesArray.length - 1] : new Date(date)
    console.log(timestamp)
    const foundData = await Statistics
        .aggregate([
            {
                $match: { 
                    name: world,    
                    creationTime: timestamp
                }
            },
            {
                $project: {
                    filteredProfsByLvl: {
                        $filter: {
                            input: '$profsByLvl',
                            as: 'element',
                            cond: { 
                                $and: [
                                    {
                                        $gte: ['$$element.lvl', min]
                                    },
                                    {
                                        $lte: ['$$element.lvl', max]
                                    }
                                ]
                             }
                        }
                    },
                    _id: 0,
                    name: 1,
                    nCharacters: 1,
                    maxLvl: 1,
                }
            }
        ])

    const profsData = [
        {
            name: 'Wojownik',
            q: 0,
            p: 0
        },
        {
            name: 'Mag',
            q: 0,
            p: 0
        },
        {
            name: 'Paladyn',
            q: 0,
            p: 0
        },
        {
            name: 'Tropiciel',
            q: 0,
            p: 0
        },
        {   
            name: 'Łowca',
            q: 0,
            p: 0
        },
        {
            name: 'Tancerz ostrzy',
            q: 0,
            p: 0
        }
    ]

    console.log(foundData)

    foundData[0].filteredProfsByLvl.map((lvl) => {
        profsData[0].q += lvl.profs['Wojownik']
        profsData[1].q += lvl.profs['Mag']
        profsData[2].q += lvl.profs['Paladyn']
        profsData[3].q += lvl.profs['Tropiciel']
        profsData[4].q += lvl.profs['Łowca']
        profsData[5].q += lvl.profs['Tancerz ostrzy']
    })

    const totalCharsInRange = 
        profsData[0].q +
        profsData[1].q +
        profsData[2].q +
        profsData[3].q +
        profsData[4].q +
        profsData[5].q 

    profsData[0].p = ((profsData[0].q / totalCharsInRange) * 100) || 0
    profsData[1].p = ((profsData[1].q / totalCharsInRange) * 100) || 0
    profsData[2].p = ((profsData[2].q / totalCharsInRange) * 100) || 0
    profsData[3].p = ((profsData[3].q / totalCharsInRange) * 100) || 0
    profsData[4].p = ((profsData[4].q / totalCharsInRange) * 100) || 0
    profsData[5].p = ((profsData[5].q / totalCharsInRange) * 100) || 0

    const sorted = profsData.sort((a, b) => {
        return b.q - a.q
    })

    console.log(totalCharsInRange)
    console.log(sorted)

    return res.json(
        { 
            world: foundData[0].name, 
            nCharacters: foundData[0].nCharacters, 
            maxLvl: foundData[0].maxLvl, 
            sortedProfs: sorted, 
            nCharactersInRange: totalCharsInRange,
            creationTimesArray
        }
    )
}