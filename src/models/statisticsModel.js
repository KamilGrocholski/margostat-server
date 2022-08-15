import mongoose from 'mongoose'

const statisticsSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    nCharacters: Number,
    maxLvl: Number,
    profsByLvl: [
        {
            lvl: {
                type: Number,
                index: true
            },
            profs: {
                'Wojownik': Number,
                'Mag': Number,
                'Paladyn': Number,
                'Tropiciel': Number,
                'Łowca': Number,
                'Tancerz ostrzy': Number
            }
        }
    ],
    creationTime: {
        type: Date,
        required: true
    }
}, { collection: 'Statistics' })

export default mongoose.model('Statistics', statisticsSchema)