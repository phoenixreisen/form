//--- Konfig -----

export declare interface DateConfig {
    patterns: {
        de: string,
        en: string,
        [lang: string]: string,
    }
    [prop: string]: any
}

export const DateConfig: DateConfig = {
    patterns: {
        de: 'DD.MM.YYYY',
        en: 'YYYY-MM-DD',
    },
    i18n: {
        de: {
            firstDay: 1,
            previousMonth : 'Vorheriger Month',
            nextMonth     : 'Nächster Monat',
            months        : ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
            weekdays      : ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
            weekdaysShort : ['So','Mo','Di','Mi','Do','Fr','Sa'],
        },
    },
};

//--- Enums & Objects -----

export enum UserTypes {
    agency = 'agency',
    phoenix = 'phoenix',
    employee = 'employee',
    customer = 'customer',
};

export enum ValidationTypes {
    empty = 'empty',
    invalid = 'invalid',
    notequal = 'not-equal',
    notunique = 'not-unique',
    outOfRange = 'out-of-range',
};

export const ValidationRules = {
    complete: /^[0-9 /+-]+$/,
    arealess: /^[1-9 -]+$/,
    area: /^\+[0-9-]{2,7}$/,
    strict:  /^[0-9+]+$/,
    numbers: /^[0-9]+$/
};