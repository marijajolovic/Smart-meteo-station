

export interface Merenje{
    id: Number,
    senzor_naziv: string,
    velicina_naziv: string,
    vrednost: Number,
    jedinica: string,
    timestamp: string,
}

export interface MerenjeNajnovije{
    id: Number,
    senzor_naziv: string,
    velicina_naziv: string,
    vrednost: Number,
    jedinica: string,
    status: string,
}

export interface MerenjeRazlika{
    senzor: String,
    values: [Number, Number],
}