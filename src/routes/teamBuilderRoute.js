import express from 'express'

const router = express.Router()

import {
    getClan
} from '../controllers/teamBuilderController.js'

router.route('/clan/:link').get(getClan)

export default router