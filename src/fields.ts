import { DateField, DateFieldFactory, Field, FieldFactory, Hook, Iban, PhoneField } from './types';
import { ValidationTypes, DateConfig, ValidationRules } from './config';
import { hasValidPhoneNrPrefix } from './functions';
import isEmail from 'validator/lib/isEmail';
import isInt from 'validator/lib/isInt';
import datetime from 'date-and-time';
import stream from 'mithril/stream';
import isIban from 'iban';

//--- Helper -----

const callHook = (input: any, field: Field<any>, hook?: Hook): any => {
    const hooked = (hook && hook(input, field));
    return (hooked !== null && hooked !== undefined)
        ? hooked
        : input;
}

//--- Felder -----

export const text: FieldFactory = (required = true, hook) => {
    const text: Field<string> = {
        value: stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input = '') => {
            const {mirror} = text;
            text.complaint = (!input.trim() && text.required)
                ? ValidationTypes.empty
                : (mirror && (mirror.value() !== input))
                    ? ValidationTypes.notequal
                    : false;

            input = callHook(input, text, hook);
            text.value(input);
        },
    };
    return text;
};

export const int: FieldFactory = (required = true, hook) => {
    const int: Field<string> = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            int.complaint = (!input.trim() && int.required)
                ? ValidationTypes.empty
                : (input && !isInt(input))
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, int, hook);
            int.value(input.toString());
        },
    };
    return int;
};

export const email: FieldFactory = (required = true, hook) => {
    const email: Field<string> = {
        value: stream(''),
        complaint: false,
        mirror: undefined,
        required: required,
        validate: (input = '') => {
            const {mirror} = email;
            email.complaint = (!input.trim() && email.required)
                ? ValidationTypes.empty
                : (input.trim() && !isEmail(input))
                    ? ValidationTypes.invalid
                    : (mirror && mirror.value() !== input)
                        ? ValidationTypes.notequal
                        : false;

            input = callHook(input, email, hook);
            email.value(input);
        },
    };
    return email;
};

export const date: DateFieldFactory = (required = true, langs=['de'], daterange, hook) => {
    const date: DateField = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '', range = daterange) => {
            const {patterns} = DateConfig;
            const {isValid, parse} = datetime;
            let datelang = '';

            if(!input.trim() && date.required) {
                date.complaint = ValidationTypes.empty;
            } else if(input.trim()) {
                date.complaint = ValidationTypes.invalid;
                for(const key of langs) {
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
            input = (hook && hook(input, datelang, range, date)) as string || input;
            date.value(input);
        },
        getDate: () => {
            const {patterns} = DateConfig;
            for(const key of langs) {
                if(datetime.isValid(date.value(), patterns[key])) {
                    return datetime.parse(date.value(), patterns[key]);
                }
            }
            return null;
        },
    };
    return date;
};

export const time: FieldFactory = (required = true, hook) => {
    const time: Field<string> = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            const {isValid} = datetime;
            time.complaint = (!input.trim() && time.required)
                ? ValidationTypes.empty
                : (input.trim() && !isValid(input, 'hh:mm'))
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, time, hook);
            time.value(input);
        },
    };
    return time;
};

export const gender: FieldFactory = (required = true, hook) => {
    const gender: Field<string> = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            const types = ['herr', 'frau', 'maenlich', 'maennlich', 'weiblich', 'divers'];
            gender.complaint = (!input.trim() && gender.required)
                ? gender.complaint = ValidationTypes.empty
                : (input.trim() && !types.filter((item) => (item === input.toLowerCase())).length)
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, gender, hook);
            gender.value(input);
        },
    };
    return gender;
};

export const phone: FieldFactory = (required = true, hook = undefined, rule = ValidationRules.complete) => {
    const phone: PhoneField = {
        value: stream(''),
        complaint: false,
        required: required,
        hasValidPrefix: hasValidPhoneNrPrefix,
        validate: (input = '', exp = rule) => {
            // wenn es nicht der Regel entspricht, verwerfe es.
            if(!input.trim() || input.match(exp)) {
                phone.complaint = (
                    (!input.trim().length && phone.required) ||
                    ((input.trim().length > 0) && !input.match(exp))
                );
                input = callHook(input, phone, hook);
                phone.value(input);
            }
        },
    };
    return phone;
};

export const radio: FieldFactory = (required = true, hook) => {
    const radio: Field<boolean|null> = {
        value: stream(),
        complaint: false,
        required: required,
        validate: (input = null) => {
            const isNotClicked = (input === null || input === undefined);
            radio.complaint = (isNotClicked && radio.required);
            input = callHook(input, radio, hook);
            radio.value(input);
        },
    };
    return radio;
};

export const checkbox: FieldFactory = (required = true, hook) => {
    const checkbox: Field<boolean> = {
        value: stream(),
        complaint: false,
        required: required,
        validate: (input = false) => {
            const checked = input ? true : false;
            checkbox.complaint = (!checked && checkbox.required);
            input = callHook(input, checkbox, hook);
            checkbox.value(checked);
        },
    };
    return checkbox;
};

export const bookingnr: FieldFactory = (required = true, hook) => {
    const bookingnr: Field<string> = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            bookingnr.complaint = (!input.trim() && bookingnr.required)
                ? ValidationTypes.empty
                : (input && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, bookingnr, hook);
            bookingnr.value(input);
        },
    };
    return bookingnr;
};

export const agencyid: FieldFactory = (required = true, hook) => {
    const agencyid: Field<string> = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            agencyid.complaint = (!input.trim() && agencyid.required)
                ? ValidationTypes.empty
                : (input.trim() && (!isInt(input) || input.length !== 6))
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, agencyid, hook);
            agencyid.value(input);
        },
    };
    return agencyid;
};

export const iban: FieldFactory = (required = true, hook) => {
    const iban: Iban = {
        value: stream(''),
        complaint: false,
        required: required,
        validate: (input = '') => {
            iban.complaint = (iban.required && !input.trim())
                ? ValidationTypes.empty
                : (input.trim() && !isIban.isValid(input))
                    ? ValidationTypes.invalid
                    : false;

            input = callHook(input, iban, hook);
            iban.value(input);
        },
        format: (e: any) => {
            const target = e?.target || e;
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