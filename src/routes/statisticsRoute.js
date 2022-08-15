import express from 'express'
const router = express.Router()

import {
    getGlobalCharactersHistory,
    getTheMostRecentData,
    getOneWorldByDate,
    getOneWorldProfsFilteredByLvl
} from '../controllers/statisticsController.js'

router.route('/getGlobalHistory').get(getGlobalCharactersHistory)
router.route('/getTheMostRecentData').get(getTheMostRecentData)
router.route('/worlds/:world').get(getOneWorldByDate)
router.route('/worlds/profs/:world').get(getOneWorldProfsFilteredByLvl)

export default router