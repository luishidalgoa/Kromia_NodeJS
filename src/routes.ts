import { Router } from "express";
import albumRouter from "./Albums/album.route";

const router = Router();

router.use("/albums", albumRouter);

export default router;