import express from 'express'

const router = express.Router()

import {
    getDatesArray,
    getGlobalRanks,
    getWorldRanks
} from '../controllers/ranksController.js'

router.route('/worlds/global').get(getGlobalRanks)
router.route('/worlds/:world').get(getWorldRanks)
router.route('/datesArray').get(getDatesArray)

export default router