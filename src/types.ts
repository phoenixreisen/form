import { ValidationTypes } from './config';
import stream from 'mithril/stream';

declare type AbstractField<T> = {
    value: stream<T>,
    mirror?: Field<T>,
    required: boolean,
    rules?: {[key: string]: RegExp},
    complaint: boolean | ValidationTypes,
}

export declare type PhonePrefix = {
    img?: string,
    name: string,
    prefix: {
        string: string,
        number: number
    }
}

export declare type Langs = Array<string>;
export declare type Daterange = Array<Date>;

export declare type Field<T> = AbstractField<T> & {
    validate: (value: T, exp?: RegExp) => void,
    [key: string]: unknown,
};

export declare type Iban = AbstractField<string> & {
    format: (e: HTMLInputElement) => void
    validate: (value: string) => void,
};

export declare type DateField = AbstractField<string> & {
    getDate(): Date | number | null
    validate: (input: string, range?: Daterange) => void
};

export declare type PhoneField = AbstractField<string> & {
    hasValidPrefix(phonenr: string, prefixes: Array<PhonePrefix>): boolean
    validate: (input: string, exp?: RegExp) => void,
};

export declare type Hook = (input: any, field: Field<any>) => string|void;
export declare type DateFieldHook = (input: any, datelang?: string, daterange?: Daterange, field?: DateField) => string|void;

export declare type FieldFactory = (required?: boolean, hook?: Hook, rule?: RegExp) => Field<any>;
export declare type DateFieldFactory = (required?: boolean, langs?: Langs, daterange?: Array<Date>, hook?: DateFieldHook) => DateField;
