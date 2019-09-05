import DateTime from 'date-and-time';
import Stream from 'mithril/stream';

import isIban from 'iban';
import isInt from 'validator/lib/isInt';
import isEmpty from 'validator/lib/isEmpty';
import isNumeric from 'validator/lib/isNumeric';

require('date-and-time/locale/de');
DateTime.locale('de');

const DateConfig = {
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

const UserTypes = {
    customer: 'customer',
    employee: 'employee',
    phoenix: 'phoenix',
    agency: 'agency',
};

const ValidationTypes = {
    empty: 'empty',
    invalid: 'invalid',
    notequal: 'not-equal',
};

// ---
// FELDER
// ---

const text = (required = true, hook = undefined) => {
    const text = {
        value: Stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input) => {
            const { mirror } = text;
            if((!input || isEmpty(input)) && text.required) {
                text.complaint = ValidationTypes.empty;
            } else if(mirror && (mirror.value() !== input)) {
                text.complaint = ValidationTypes.notequal;
            } else {
                text.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            text.value(input);
        },
    };
    return text;
};

const int = (required = true, hook = undefined) => {
    const int = {
        value: Stream(null),
        complaint: false,
        required: required,
        validate: (input) => {
            if(!input && input !== 0 && int.required) {
                int.complaint = ValidationTypes.empty;
            } else if(input && !isInt(input)) {
                int.complaint = ValidationTypes.invalid;
            } else {
                int.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            int.value(input);
        },
    };
    return int;
};

const email = (required = true, hook = undefined) => {
    const email = {
        value: Stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input) => {
            const { mirror } = email;
            if((!input || isEmpty(input)) && email.required) {
                email.complaint = ValidationTypes.empty;
            } else if(isNumeric(input)) {
                email.complaint = ValidationTypes.invalid;
            } else if(mirror && mirror.value() !== input) {
                email.complaint = ValidationTypes.notequal;
            } else {
                email.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            email.value(input);
        },
    };
    return email;
};

const date = (required = true, hook = undefined) => {
    const date = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            const { patterns } = DateConfig;
            if((!input || isEmpty(input)) && date.required) {
                date.complaint = ValidationTypes.empty;
            } else if(!DateTime.isValid(input, patterns.de) || input.length < patterns.de.length) {
                date.complaint = ValidationTypes.invalid;
            } else {
                date.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            date.value(input);
        },
        getDate: () => {
            const { patterns } = DateConfig;
            if(DateTime.isValid(date.value(), patterns.de)) {
                return DateTime.parse(date.value(), patterns.de);
            } else if(DateTime.isValid(date.value(), patterns.en)) {
                return DateTime.parse(date.value(), patterns.en);
            } else {
                return null;
            }
        },
    };
    return date;
};

const nativeDate = (required = true, daterange = undefined, hook = undefined) => {
    const date = {
        complaint: '',
        required: required,
        value: Stream(undefined),
        validate: (datestring, range = daterange) => {
            const { parse, isValid } = DateTime;
            const { patterns } = DateConfig;

            date.complaint = '';
            if((!datestring || !datestring.length) && date.required) {
                date.complaint = 'empty';
            }
            else if((datestring) 
            && (!isValid(datestring, patterns.de) || datestring.length < patterns.de.length)
            && (!isValid(datestring, patterns.en) || datestring.length < patterns.en.length)) {
                date.complaint = 'invalid';
            }
            if(!date.complaint) {
                const inputdate = isNaN(parse(datestring, patterns.de))
                    ? parse(datestring, patterns.en)
                    : parse(datestring, patterns.de);
                
                if(range && (range[0] && (inputdate < range[0]) || (range[1] && inputdate > range[1]))) {
                    date.complaint = 'out-of-range';
                }
            }
            datestring = hook 
                ? hook.call(this, datestring) 
                : datestring;
            date.value(datestring);
        },
        getDate: () => {
            const { patterns } = DateConfig;
            if(DateTime.isValid(date.value(), patterns.de)) {
                return DateTime.parse(date.value(), patterns.de);
            } else if(DateTime.isValid(date.value(), patterns.en)) {
                return DateTime.parse(date.value(), patterns.en);
            } else {
                return null;
            }
        },
    };
    return date;
};

const time = (required = true, hook = undefined) => {
    const time = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            if((!input || isEmpty(input)) && time.required) {
                time.complaint = ValidationTypes.empty;
            } else if(!DateTime.isValid(input, 'hh:mm')) {
                time.complaint = ValidationTypes.invalid;
            } else {
                time.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            time.value(input);
        },
    };
    return time;
};

const gender = (required = true, hook = undefined) => {
    const gender = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            if((!input || isEmpty(input)) && gender.required) {
                gender.complaint = ValidationTypes.empty;
            } else if(input.length &&
                input !== 'maenlich' && 
                input !== 'weiblich' &&
                input !== 'divers'
            ) {
                gender.complaint = ValidationTypes.invalid;
            }  else {
                gender.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            gender.value(input);
        },
    };
    return gender;
};

const phone = (required = true, hook = undefined) => {
    const phone = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            if(input.length && !input.match(/^[0-9+-]+$/)) {
                return; // wenn es keine Ziffer ist, verwerfe es.
            } else if((!input || isEmpty(input)) && phone.required) {
                phone.complaint = true;
            } else {
                phone.complaint = false;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            phone.value(input);
        },
    };
    return phone;
};

const radio = (required = true, hook = undefined) => {
    const radio = {
        value: Stream(null),
        complaint: false,
        required: required,
        validate: (input) => {
            radio.complaint = (input === null && radio.required);
            input = hook 
                ? hook.call(this, input) 
                : input;
            radio.value(input);
        },
    };
    return radio;
};

const checkbox = (required = true, hook = undefined) => {
    const checkbox = {
        value: Stream(false),
        complaint: false,
        required: required,
        validate: (input) => {
            const checked = input ? true : false;
            checkbox.complaint = (!checked && checkbox.required);
            input = hook 
                ? hook.call(this, input) 
                : input;
            checkbox.value(checked);
        },
    };
    return checkbox;
};

const bookingnr = (required = true, hook = undefined) => {
    const bookingnr = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: input => {
            bookingnr.complaint = ((!input || isEmpty(input)) && bookingnr.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;
            input = hook 
                ? hook.call(this, input) 
                : input;
            bookingnr.value(input);
        },
    };
    return bookingnr;
};

const agencyid = (required = true, hook = undefined) => {
    const agencyid = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            agencyid.complaint = (
                !input
                || !isInt(input) 
                || isEmpty(input) 
                || input.length !== 6
            );
            input = hook 
                ? hook.call(this, input) 
                : input;
            agencyid.value(input);
        },
    };
    return agencyid;
};

const iban = (required = true, hook = undefined) => {
    const iban = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            iban.complaint = false;
            if(iban.required && (!input || isEmpty(input))) {
                iban.complaint = ValidationTypes.empty;
            }
            else if(input && !isIban.isValid(input)) {
                iban.complaint = ValidationTypes.invalid;
            }
            input = hook 
                ? hook.call(this, input) 
                : input;
            iban.value(input);
        },
    };
    return iban;
};

const fields = {
    text, int,
    date, time, 
    radio, checkbox,
    phone, gender, email,
    agencyid, bookingnr,
};


// ---
// FUNKTIONEN
// ---

/**
  * gibt die jeweilige Status-CSS-Klasse
  * für den Submit-Button zurück.
  * @param {bool} success 
  * @param {bool/object} error 
  * @returns {string} CSS Klasse
  */
function getBtnStatusClass(success, error) {
    let classname = '';
    classname = success ? 'btn--success' : classname;
    classname = error ? 'btn--danger' : classname;
    return classname;
}

/**
  * Ruf die validate()-Funktionen aller Felder
  * auf und prüft anschließend, ob alle valide sind.
  * Gut, um ein ganzes Formular vor Submit zu prüfen.
  * @param {array} fields 
  * @returns {bool} ja/nein
  */
function isValidInput(fields) {
    const fieldnames = Object.keys(fields);
    let hasErrors = false;
    // validate() aller Felder aufrufen und complaint prüfen
    for(let i=0; i < fieldnames.length; i+=1) {
        const field = fields[fieldnames[i]];
        field.validate(field.value());
        hasErrors = field.complaint ? true:hasErrors;
    }
    return !hasErrors;
}

/**
 * Prüft, ob der Browser einen eigenen
 * nativen Datepicker mitbringt oder nicht.
 * @returns {bool} ja/nein
 */
function isDateSupported() {
    const value = 'test';
    const input = document.createElement('input');
    input.setAttribute('type', 'date');
    input.setAttribute('value', value);
    return (input.value !== value);
}


export {
    fields,
    UserTypes,
    DateConfig,
    isValidInput,
    isDateSupported,
    getBtnStatusClass,
    ValidationTypes,
    bookingnr, agencyid,
    gender, phone, email,
    text, int, date, nativeDate,
    time, radio, checkbox, iban,
};
export default fields;