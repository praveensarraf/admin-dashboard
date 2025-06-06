import express from 'express';
import upload from '../middlewares/multer.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadAndDistribute, getTasksGroupedByAgent } from '../controllers/taskController.js';

const router = express.Router();

router.route("/upload").post(isAuthenticated, upload.single("file"), uploadAndDistribute);
router.route("/get").get(isAuthenticated, getTasksGroupedByAgent);

export default router;