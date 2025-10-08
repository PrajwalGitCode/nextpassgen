import express from "express";
import {
  createVaultItem,
  getVaultItems,
  updateVaultItem,
  deleteVaultItem,
} from "../controllers/vaultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // protect all routes

router.post("/", createVaultItem);
router.get("/", getVaultItems);
router.put("/:id", updateVaultItem);
router.delete("/:id", deleteVaultItem);

export default router;
