import {ValidationTypes} from "./config";
import stream from 'mithril/stream';

//--- Types -----

export type Langs = Array<string>;

export type Daterange = Array<Date>;

export type Field<T> = {
    value: stream<T>,
    mirror?: Field<T>,
    required: boolean,
    complaint: boolean | ValidationTypes,
    validate: (value: T) => void,
    [key: string]: any,
};

export type DateField = Field<string> & {
    getDate(): Date | number | null
    validate: (input: string, range?: Daterange) => void
};

export type Iban = Field<string> & {
    format: (e: HTMLInputElement) => void
};

export interface DateConfig {
    patterns: {
        de: string,
        en: string,
        [lang: string]: string,
    }
    [prop: string]: any
}

//--- Funktionen -----

export type Hook = (input: any, field: Field<any>) => any|void;
export type DateFieldHook = (input: any, datelang?: string, daterange?: Daterange, field?: DateField) => any|void;

export type FieldFactory = (required?: boolean, hook?: Hook) => Field<any>;
export type DateFieldFactory = (required?: boolean, langs?: Langs, daterange?: Array<Date>, hook?: DateFieldHook) => DateField;