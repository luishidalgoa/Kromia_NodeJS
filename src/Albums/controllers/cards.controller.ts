import { NextFunction, Request, response, Response } from "express";
import Album from "../models/albums.model";
import mongoose from "mongoose";

export async function getCards(req: Request, res: Response) {
    try {
        const limit: number = parseInt(req.query.limit?.toString() === "0" || req.query.limit?.toString() === "" ? "1" : req.query.limit?.toString() ?? "12");
        const page:number = parseInt(req.query.page?.toString() ?? "0");
        const skip:number = page * limit;
        

        const albumId = new mongoose.Types.ObjectId(req.params.id);
        const cards = await Album.aggregate([{ $match: { _id: albumId } }, { $unwind: "$data.cards" }, { $replaceWith: "$data.cards" }, { $skip: skip }, { $limit: limit }])
        res.status(200).json(cards);
    } catch (error) { }
}

function pagination(req: Request): Record<string, any> {
    const page = parseInt(req.query.page?.toString() ?? "0");
    const limit: number = parseInt(req.query.limit?.toString() ?? "12");
    let $addFields: Record<string, any> = {
        'data.cards': { $slice: ['$data.cards', page, limit] } // valor por defecto de paginacion
    };

    if (limit === 0) {
        $addFields['data.cards'] = []; // array vacío
    } else {
        const skip = page * limit;
        $addFields['data.cards'] = { $slice: ['$data.cards', skip, limit] };
    }

    return $addFields
}

export function getCardsPagination(req: Request) {
    return pagination(req);
}