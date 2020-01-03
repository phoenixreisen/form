import { ValidationTypes, DateConfig } from './config';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import isInt from 'validator/lib/isInt';
import DateTime from 'date-and-time';
import Stream from 'mithril/stream';
import isIban from 'iban';

//--- INIT -----

require('date-and-time/locale/de');
DateTime.locale('de');

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
        value: Stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input) => {
            const { mirror } = text;
            text.complaint = ((!input || isEmpty(input.trim())) && text.required)
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
        value: Stream(null),
        complaint: false,
        required: required,
        validate: (input) => {
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
        value: Stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input) => {
            const { mirror } = email;
            email.complaint = ((!input || isEmpty(input.trim())) && email.required)
                ? ValidationTypes.empty
                : (!isEmpty(input) && !isEmail(input))
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

export const date = (required = true, hook = undefined) => {
    const date = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            const { patterns } = DateConfig;
            date.complaint = ((!input || isEmpty(input.trim())) && date.required)
                ? ValidationTypes.empty
                : (!DateTime.isValid(input, patterns.de) || input.length < patterns.de.length)
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, date);
            date.value(input);
        },
        getDate: () => {
            const { patterns } = DateConfig;
            return (DateTime.isValid(date.value(), patterns.de))
                ? DateTime.parse(date.value(), patterns.de)
                : (DateTime.isValid(date.value(), patterns.en))
                    ? DateTime.parse(date.value(), patterns.en)
                    : null;
        },
    };
    return date;
};

export const nativeDate = (required = true, daterange = undefined, hook = undefined) => {
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
            return (DateTime.isValid(date.value(), patterns.de))
                ? DateTime.parse(date.value(), patterns.de)
                : (DateTime.isValid(date.value(), patterns.en))
                    ? DateTime.parse(date.value(), patterns.en)
                    : null;
        },
    };
    return date;
};

export const time = (required = true, hook = undefined) => {
    const time = {
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            time.complaint = ((!input || isEmpty(input.toString().trim())) && time.required)
                ? ValidationTypes.empty
                : (!DateTime.isValid(input, 'hh:mm'))
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
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            gender.complaint = ((!input || isEmpty(input.trim())) && gender.required)
                ? gender.complaint = ValidationTypes.empty
                : (input.length &&
                    input.toLowerCase() !== 'herr' &&
                    input.toLowerCase() !== 'frau' &&
                    input.toLowerCase() !== 'maenlich' &&
                    input.toLowerCase() !== 'maennlich' &&
                    input.toLowerCase() !== 'weiblich' &&
                    input.toLowerCase() !== 'divers')
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
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            // wenn es keine Ziffer ist, verwerfe es.
            if(!input.length || input.match(/^[0-9+-]+$/)) {
                phone.complaint = ((!input || isEmpty(input)) && phone.required);
                input = hookIt(hook, input, phone);
                phone.value(input);
            }
        },
    };
    return phone;
};

export const radio = (required = true, hook = undefined) => {
    const radio = {
        value: Stream(null),
        complaint: false,
        required: required,
        validate: (input) => {
            radio.complaint = (input === null && radio.required);
            input = hookIt(hook, input, radio);
            radio.value(input);
        },
    };
    return radio;
};

export const checkbox = (required = true, hook = undefined) => {
    const checkbox = {
        value: Stream(false),
        complaint: false,
        required: required,
        validate: (input) => {
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
        value: Stream(''),
        complaint: false,
        required: required,
        validate: (input) => {
            bookingnr.complaint = ((!input || isEmpty(input)) && bookingnr.required)
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
        value: Stream(''),
        complaint: false,
        required: required,
        validate: input => {
            agencyid.complaint = ((!input || isEmpty(input.trim())) && agencyid.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
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
        value: Stream(''),
        complaint: false,
        required: required,
        validate: input => {
            iban.complaint = (iban.required && (!input || isEmpty(input.trim())))
                ? ValidationTypes.empty
                : (input && !isIban.isValid(input))
                    ? ValidationTypes.invalid
                    : false;

            input = hookIt(hook, input, iban);
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