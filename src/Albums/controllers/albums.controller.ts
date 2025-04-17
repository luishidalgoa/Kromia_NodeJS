import { NextFunction, Request, response, Response } from "express";
import Album, { Metadata } from "../models/albums.model";

export async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    const { skip, limit } = pagination(req);
    try {
        const albums = await Album.aggregate([{$set:{"data.cards":[],"data.additionalData":{}}}]).skip(skip).limit(limit);
        res.status(200).json(albums);
    } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener los álbumes", details: error });
    }
}

export async function createAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        const album = await Album.create(req.body);
        res.status(200).json(album);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el álbum", details: error });
    }
};

export async function deleteAlbum(req: Request, res: Response) {
    try {
        const status = await Album.deleteOne({ "metadata.name": req.params.name });
        console.log(status);
        if (status.deletedCount > 0) {
            res.status(200).json({ message: "Album eliminado" });
        } else {
            res.status(500).json({ error: "No se encontro el álbum" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el álbum", details: error });
    }
}

export async function findAlbum(req: Request, res: Response) {
    try {
        //extraemos los campos que se pueden filtrar a partir de los atributos de un modelo
        const allowedFilters = Object.entries(new Metadata()).reduce((acc, [key, value]) => {
            acc.push(key);
            return acc
        }).filter((key) => key !== '');
        //extraemos los parametros de la consulta
        const params = Object.entries(req.query)
        //declaramos las restricciones que se deben cumplir cuando busquemos un objeto en la coleccion de mongodb
        const $match = params.reduce((acc, [key, value]) => {
            if (allowedFilters.includes(key) && value) {
                acc[`metadata.${key}`] = key === 'name' || key === 'publisher' ? { $regex: value, $options: 'i' } : value
            }
            return acc
        }, {} as Record<string, any>)

        //Algoritmo de paginación a partir de parametros
        const {skip,limit}= pagination(req)

        res.status(200).json(await Album
            .aggregate([{ $match }, {$set:{"data.cards":[],"data.additionalData":{}}}]).skip(skip).limit(limit)
        );
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el álbum", details: error });
    }
}

import mongoose from 'mongoose';
import { getCards, getCardsPagination } from "./cards.controller";

export async function findAlbumById(req: Request, res: Response) {
    try {
        const albumId = new mongoose.Types.ObjectId(req.params.id);
        const addFields = getCardsPagination(req);

        const album = await Album.aggregate([
            { $match: { _id: albumId } },{ $addFields:addFields }])

        if (album.length > 0) {
            res.status(200).json(album);
        } else {
            res.status(404).json({ error: 'No se encontró el álbum' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el álbum', details: error });
    }
}

function pagination(req: Request):{skip:number,limit:number} {

    const page = parseInt(req.query.page?.toString() ?? "0");
    const limit:number = parseInt(req.query.limit && parseInt(req.query.limit.toString()) > 0?(req.query.limit.toString() ?? "6"):"1"); 


    return {skip:page*limit,limit:limit}
}