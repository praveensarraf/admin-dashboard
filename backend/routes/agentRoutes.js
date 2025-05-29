import express from 'express';
import { addAgent, getAgents, deleteAgent } from '../controllers/agentController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/add").post(isAuthenticated, addAgent);
router.route("/get").get(isAuthenticated, getAgents);
router.route("/:id/delete").delete(isAuthenticated, deleteAgent);

export default router;