import { ValidationTypes, DateConfig } from './config';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isInt from 'validator/lib/isInt';
import DateTime from 'date-and-time';
import Stream from 'mithril/stream';
import isIban from 'iban';

export {
    bookingnr, agencyid,
    gender, phone, email,
    text, int, date, nativeDate,
    time, radio, checkbox, iban
};

// INIT ------------------------------------------------------

require('date-and-time/locale/de');
DateTime.locale('de');

// FELDER ----------------------------------------------------

const text = (required = true, hook = undefined) => {
    const text = {
        value: Stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input) => {
            const { mirror } = text;
            if((!input || isEmpty(input.trim())) && text.required) {
                text.complaint = ValidationTypes.empty;
            } else if(mirror && (mirror.value() !== input)) {
                text.complaint = ValidationTypes.notequal;
            } else {
                text.complaint = false;
            }
            const hooked = (hook && hook(input, text));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            const hooked = (hook && hook(input, int));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            if((!input || isEmpty(input.trim())) && email.required) {
                email.complaint = ValidationTypes.empty;
            } else if(!isEmpty(input) && !isEmail(input)) {
                email.complaint = ValidationTypes.invalid;
            } else if(mirror && mirror.value() !== input) {
                email.complaint = ValidationTypes.notequal;
            } else {
                email.complaint = false;
            }
            const hooked = (hook && hook(input, email));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            if((!input || isEmpty(input.trim())) && date.required) {
                date.complaint = ValidationTypes.empty;
            } else if(!DateTime.isValid(input, patterns.de) || input.length < patterns.de.length) {
                date.complaint = ValidationTypes.invalid;
            } else {
                date.complaint = false;
            }
            const hooked = (hook && hook(input, date));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
                date.complaint = ValidationTypes.empty;
            }
            else if((datestring)
            && (!isValid(datestring, patterns.de) || datestring.length < patterns.de.length)
            && (!isValid(datestring, patterns.en) || datestring.length < patterns.en.length)) {
                date.complaint = ValidationTypes.invalid;
            }
            if(!date.complaint) {
                const inputdate = isNaN(parse(datestring, patterns.de))
                    ? parse(datestring, patterns.en)
                    : parse(datestring, patterns.de);
                if(range && (range[0] && (inputdate < range[0])
                || (range[1] && inputdate > range[1]))) {
                    date.complaint = ValidationTypes.outOfRange;
                }
            }
            const hooked = (hook && hook(datestring, range, date));
            datestring = (hooked !== null && hooked !== undefined)
                ? hooked
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
            if((!input || isEmpty(input.toString().trim())) && time.required) {
                time.complaint = ValidationTypes.empty;
            } else if(!DateTime.isValid(input, 'hh:mm')) {
                time.complaint = ValidationTypes.invalid;
            } else {
                time.complaint = false;
            }
            const hooked = (hook && hook(input, time));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            if((!input || isEmpty(input.trim())) && gender.required) {
                gender.complaint = ValidationTypes.empty;
            } else if(input.length &&
                input.toLowerCase() !== 'herr' &&
                input.toLowerCase() !== 'frau' &&
                input.toLowerCase() !== 'maenlich' &&
                input.toLowerCase() !== 'maennlich' &&
                input.toLowerCase() !== 'weiblich' &&
                input.toLowerCase() !== 'divers')
            {
                gender.complaint = ValidationTypes.invalid;
            }  else {
                gender.complaint = false;
            }
            const hooked = (hook && hook(input, gender));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            const hooked = (hook && hook(input, phone));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            const hooked = (hook && hook(input, radio));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
            const hooked = (hook && hook(input, checkbox));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
        validate: (input) => {
            bookingnr.complaint = ((!input || isEmpty(input)) && bookingnr.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            const hooked = (hook && hook(input, bookingnr));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
        validate: input => {
            agencyid.complaint = ((!input || isEmpty(input.trim())) && agencyid.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            const hooked = (hook && hook(input, agencyid));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
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
        validate: input => {
            iban.complaint = false;
            if(iban.required && (!input || isEmpty(input.trim()))) {
                iban.complaint = ValidationTypes.empty;
            }
            else if(input && !isIban.isValid(input)) {
                iban.complaint = ValidationTypes.invalid;
            }
            const hooked = (hook && hook(input, iban));
            input = (hooked !== null && hooked !== undefined)
                ? hooked
                : input;
            iban.value(input);
        },
        format: e => {
            const target = e.target || e;
            const length = target.value.length;
            let position = target.selectionEnd;
            iban.complaint = false;
            target.value = target.value
                .replace(/[^\dA-Z]/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim();
            target.selectionEnd = position += ((
                target.value.charAt(position - 1) === ' '
                && target.value.charAt(length - 1) === ' '
                && length !== target.value.length)
                ? 1 : 0
            );
            iban.validate(target.value);
        },
    };
    return iban;
};