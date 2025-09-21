import { Senzor } from "./senzor";
import { Velicina } from "./velicina";

export interface Merenje{
    id: Number,
    senzor: Senzor,
    velicina: Velicina,
    vrednost: Number,
    date: string,
}