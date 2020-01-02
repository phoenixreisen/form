//--- ENUMS & KONFIG -----

export const DateConfig = {
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

export const UserTypes = {
    customer: 'customer',
    employee: 'employee',
    phoenix: 'phoenix',
    agency: 'agency',
};

export const ValidationTypes = {
    empty: 'empty',
    invalid: 'invalid',
    notequal: 'not-equal',
    outOfRange: 'out-of-range',
};