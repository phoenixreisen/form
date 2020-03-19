import {ValidationTypes, DateConfig} from './config';
import isEmail from 'validator/lib/isEmail';
import isInt from 'validator/lib/isInt';
import datetime from 'date-and-time';
import stream from 'mithril/stream';
import isIban from 'iban';

//--- HELPER -----

const hookIt = (hook, input, field) => {
    const hooked = (hook && hook(input, field));
    return (hooked !== null && hooked !== undefined)
        ? hooked
        : input;
}

//--- FELDER -----

export const text = (required = true, hook = undefined) => {
    const text = {
        value: stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input = '') => {
            const { mirror } = text;
            text.complaint = (!input.trim() && text.required)
                ? ValidationTypes.empty
                : (mirror && (mirror.value() !== input))
                    ? ValidationTypes.notequal
                    : false;

            input = hookIt(hook, input, text);
            text.value(input);
        },
    };
    return text;
};

export const int = (required = true, hook = undefined) => {
    const int = {
        value: stream(null),
        complaint: false,
        required: required,
        validate: (input = null) => {
            int.complaint = (!input && input !== 0 && int.required)
                ? ValidationTypes.empty
                : (input && !isInt(input))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, int);
            int.value(input);
        },
    };
    return int;
};

export const email = (required = true, hook = undefined) => {
    const email = {
        value: stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input = '') => {
            const { mirror } = email;
            email.complaint = (!input.trim() && email.required)
                ? ValidationTypes.empty
                : (input.trim() && !isEmail(input))
                    ? ValidationTypes.invalid
                    : (mirror && mirror.value() !== input)
                        ? ValidationTypes.notequal
                        : false;

            input = hookIt(hook, input, email);
            email.value(input);
        },
    };
    return email;
};

export const date = (required = true, langs = ['de'], daterange = null, hook = null) => {
    const langkeys = langs || ['de'];
    const date = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '', range = daterange) => {
            const { isValid, parse } = datetime;
            const { patterns } = DateConfig;
            let datelang = null;

            if(!input.trim() && date.required) {
                date.complaint = ValidationTypes.empty;
            } else if(input.trim()) {
                date.complaint = ValidationTypes.invalid;
                for(const key of langkeys) {
                    const isValidDate = isValid(input, patterns[key]);
                    const isTooShort = input.length < patterns[key].length;
                    if(isValidDate && !isTooShort) {
                        date.complaint = false;
                        datelang = key;
                        break;
                    }
                }
            } else {
                date.complaint = false;
            }
            if(datelang && range && !date.complaint) {
                const inputdate = parse(input, patterns[datelang]);
                if((range[0] && (inputdate < range[0]))
                || (range[1] && (inputdate > range[1]))) {
                    date.complaint = ValidationTypes.outOfRange;
                }
            }
            input = (hook && hook(input, datelang, range, date)) || input;
            date.value(input);
        },
        getDate: () => {
            const { patterns } = DateConfig;
            for(const key of langkeys) {
                if(datetime.isValid(date.value(), patterns[key])) {
                    return datetime.parse(date.value(), patterns[key]);
                }
            }
            return null;
        },
    };
    return date;
};

export const time = (required = true, hook = undefined) => {
    const time = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            const { isValid } = datetime;
            time.complaint = (!input.trim() && time.required)
                ? ValidationTypes.empty
                : (input.trim() && !isValid(input, 'hh:mm'))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, time);
            time.value(input);
        },
    };
    return time;
};

export const gender = (required = true, hook = undefined) => {
    const gender = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            const types = ['herr', 'frau', 'maenlich', 'maennlich', 'weiblich', 'divers'];
            gender.complaint = (!input.trim() && gender.required)
                ? gender.complaint = ValidationTypes.empty
                : (input.trim() && !types.includes(input))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, gender);
            gender.value(input);
        },
    };
    return gender;
};

export const phone = (required = true, hook = undefined) => {
    const phone = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            // wenn es keine Ziffer ist, verwerfe es.
            if(!input.trim() || input.match(/^[0-9+-]+$/)) {
                phone.complaint = (!input.trim() && phone.required);
                input = hookIt(hook, input, phone);
                phone.value(input);
            }
        },
    };
    return phone;
};

export const radio = (required = true, hook = undefined) => {
    const radio = {
        value: stream(null),
        complaint: false,
        required: required,
        validate: (input = null) => {
            radio.complaint = (input === null && radio.required);
            input = hookIt(hook, input, radio);
            radio.value(input);
        },
    };
    return radio;
};

export const checkbox = (required = true, hook = undefined) => {
    const checkbox = {
        value: stream(false),
        complaint: false,
        required: required,
        validate: (input = false) => {
            const checked = input ? true : false;
            checkbox.complaint = (!checked && checkbox.required);
            input = hookIt(hook, input, checkbox);
            checkbox.value(checked);
        },
    };
    return checkbox;
};

export const bookingnr = (required = true, hook = undefined) => {
    const bookingnr = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            bookingnr.complaint = (!input.trim() && bookingnr.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, bookingnr);
            bookingnr.value(input);
        },
    };
    return bookingnr;
};

export const agencyid = (required = true, hook = undefined) => {
    const agencyid = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            agencyid.complaint = (!input.trim() && agencyid.required)
                ? ValidationTypes.empty
                : (input.trim() && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, agencyid);
            agencyid.value(input);
        },
    };
    return agencyid;
};

export const iban = (required = true, hook = undefined) => {
    const iban = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            iban.complaint = (iban.required && !input.trim())
                ? ValidationTypes.empty
                : (input.trim() && !isIban.isValid(input))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, iban);
            iban.value(input);
        },
        format: e => {
            const target = e.target || e;
            const length = target.value.length;
            let position = target.selectionEnd;
            target.value = isIban.printFormat(target.value);
            target.selectionEnd = position += ((
                target.value.charAt(position - 1) === ' '
                && target.value.charAt(length - 1) === ' '
                && length !== target.value.length)
                ? 1 : 0
            );
            iban.complaint = false;
            iban.validate(target.value);
        },
    };
    return iban;
};