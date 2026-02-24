import express from express
//important always check here js i sadded here 
import { checkHealth } from "../controllers/health.controllers.js"

const router = express.Router()

router.get('/',checkHealth)

export default router;
