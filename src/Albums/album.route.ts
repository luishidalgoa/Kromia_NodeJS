import { Router } from "express";
import { getAllAlbums, createAlbum, deleteAlbum, findAlbum, findAlbumById } from "./controllers/albums.controller";
import cardsRouter from "./cards.route";

const router = Router();

router.get("/", getAllAlbums);
router.post("/", createAlbum);
router.delete("/:name", deleteAlbum);
router.get("/search", findAlbum);
router.get("/:id", findAlbumById);

router.use("/:id/cards", cardsRouter);

export default router;