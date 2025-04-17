import express,{ Router } from "express";
import { getCards } from "./controllers/cards.controller";

const router = express.Router({ mergeParams: true }); // 👈 importante

router.get("/", getCards);

export default router;