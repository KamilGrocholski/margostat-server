import express from 'express'
import cors from 'cors'
import clientDB from './db/clientDB.js'
import statisticsRoute from './routes/statisticsRoute.js'
import ranksRoute from './routes/ranksRoute.js'
import teamBuilder from './routes/teamBuilderRoute.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

//Routes
app.use('/api/statistics', statisticsRoute)
app.use('/api/ranks', ranksRoute)
app.use('/api/team-builder', teamBuilder)

const PORT = process.env.PORT || 5000
const start = async () => {
    try {
        await clientDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`>> Server działa na porcie: ${ PORT }`)
        })
    } catch (err) {
        console.log(err)
    }
}

await start()