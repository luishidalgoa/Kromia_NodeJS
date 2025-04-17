// Album.ts

import mongoose, { Schema } from "mongoose";

export class Metadata {
  name: string;
  publisher: string;
  albumType: string;
  country: string;
  description: string;
  language: string;
  releaseDate: Date | null;

  constructor() {this.name = ''; this.publisher = ''; this.albumType = ''; this.country = ''; this.description = ''; this.language = ''; this.releaseDate = null;}
}

interface Structure {
  pages: number;
  totalCards: number;
  cardsPerPage?: { array: number[]; value: number };
}
export interface AlbumBase extends Document {
  _id?: string;
  metadata: Metadata;
  properties: Structure;
  type: string;
  data: any; // <- aquí es flexible
}

const AlbumSchema = new Schema<AlbumBase>({
  metadata: {
    name: { type: String, required: true, unique: true },
    publisher: { type: String, required: true },
    albumType: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    releaseDate: Date,
  },
  properties: {
    pages: { type: Number, required: true },
    totalCards: { type: Number, required: true }
  },
  data: {
    cards: [{ type: Schema.Types.Mixed, required: false }],
    additionalData: { type: Map, of: Schema.Types.Mixed, required: false},
  },
}).set("toJSON",{
  transform: (doc, ret) => {
    delete ret.__v;
    return ret; // <- return the transformed version
  }
});

export default mongoose.model<AlbumBase>("Album", AlbumSchema);
