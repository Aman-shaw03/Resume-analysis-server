import express from "express"
import {authorize} from "../middleware/authentication.middleware.js"
import { enrichResume, searchApplicant } from "../controllers/resume.controller.js"


const router = express.Router()


router.post("/enrich", authorize, enrichResume)
router.get("/search", authorize, searchApplicant)
export default router
