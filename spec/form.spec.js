const datetime = require('date-and-time');
const form = require('../dist/form.js');
const jsdom = require('jsdom');

// DOM mocken -----------------------------------------------------
dom = new jsdom.JSDOM('', {
    // für `requestAnimationFrame`
    pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.requestAnimationFrame = dom.window.requestAnimationFrame;
// ----------------------------------------------------------------

describe("form handler - types & config", () => {
    beforeEach(() => {});
    afterEach(() => {});

    it('should provide certain UserTypes', () => {
        const {UserTypes} = form;
        const keys = Object.keys(UserTypes);
        expect(keys.length).toBeGreaterThanOrEqual(4);
        expect(UserTypes.customer).toBeDefined();
        expect(UserTypes.employee).toBeDefined();
        expect(UserTypes.phoenix).toBeDefined();
        expect(UserTypes.agency).toBeDefined();
    });

    it('should provide certain ValidationTypes', () => {
        const {ValidationTypes} = form;
        const keys = Object.keys(ValidationTypes);
        expect(keys.length).toBeGreaterThanOrEqual(4);
        expect(ValidationTypes.outOfRange).toBeDefined();
        expect(ValidationTypes.notequal).toBeDefined();
        expect(ValidationTypes.invalid).toBeDefined();
        expect(ValidationTypes.empty).toBeDefined();
    });

    it('should provide certain date patterns', () => {
        const {DateConfig} = form;
        expect(DateConfig.patterns.de).toBeDefined();
        expect(DateConfig.patterns.en).toBeDefined();
    });
});

describe("form handler - functions", () => {
    beforeEach(() => {});
    afterEach(() => {
        dom.window.close();
    });

    it('should exist', () => {
        const {isValidInput, isDateSupported, getBtnStatusClass} = form;
        expect(getBtnStatusClass).toBeDefined();
        expect(isDateSupported).toBeDefined();
        expect(isValidInput).toBeDefined();
    });

    it('should give the correct btn status class', () => {
        const error = {failure: true, details: 'bla'};
        const {getBtnStatusClass} = form;
        const succeeded = true;
        let btnClass = '';

        btnClass = getBtnStatusClass(succeeded);
        expect(btnClass).toBe('btn--success');
        btnClass = getBtnStatusClass(false, error);
        expect(btnClass).toBe('btn--danger');
    });

    it('should tell if native datepicker is supported', () => {
        // jsdom unterstützt Felder vom Typ "date".
        const {isDateSupported} = form;
        const isSupported = isDateSupported();
        expect(isSupported).toBeTruthy();
    });

    it('should fire & check the fields validation correctly', () => {
        const {int, text, isValidInput} = form;
        let isValid = false;

        const fields = {
            age: int(),
            prename: text(),
            surname: text(false)
        };
        // TEST 1 - invalid
        fields.age.validate('test');        // invalid, da int erwartet wird
        fields.prename.validate('Fabian');
        fields.surname.validate('Marcus');
        isValid = isValidInput(fields);
        expect(isValid).toBeFalsy();
        // TEST 2 - valid
        fields.age.validate('23');          // string, da es eig. aus einem input stammt
        isValid = isValidInput(fields);
        expect(isValid).toBeTruthy();
        // TEST 3 - invalid
        fields.prename.validate('');        // invalid, da Pflichtfeld
        isValid = isValidInput(fields);
        expect(isValid).toBeFalsy();
        // TEST 4 - valid
        fields.prename.validate('Fabian');
        isValid = isValidInput(fields);
        expect(isValid).toBeTruthy();
    });
});

describe("form handler - field check", () => {
    beforeEach(() => {});
    afterEach(() => {});

    it('should handle & validate booking numbers correctly', () => {
        const {ValidationTypes, bookingnr} = form;
        let field = bookingnr();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('test');
        expect(field.value()).toBe('test');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('123');
        expect(field.value()).toBe('123');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('123456');
        expect(field.value()).toBe('123456');
        expect(field.complaint).toBe(false);

        // --- Pflichtprüfung
        field = bookingnr(false);
        field.validate('');
        expect(field.complaint).toBe(false);

        // --- Hook
        field = bookingnr(true, (input) => {
            input = input + '987';
            return input;
        });
        field.validate('123456');
        expect(field.value()).toBe('123456987');
    });

    it('should handle & validate agency numbers correctly', () => {
        const {ValidationTypes, agencyid} = form;
        let field = agencyid();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('test');
        expect(field.value()).toBe('test');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('134');
        expect(field.value()).toBe('134');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('123456');
        expect(field.value()).toBe('123456');
        expect(field.complaint).toBe(false);

        // --- Pflichtprüfung
        field = agencyid(false);
        field.validate('');
        expect(field.complaint).toBe(false);

        // --- Hook
        field = agencyid(true, (input) => {
            input = input + '987';
            return input;
        });
        field.validate('123456');
        expect(field.value()).toBe('123456987');
    });

    it('should handle & validate genders correctly', () => {
        const {ValidationTypes, gender} = form;
        let field = gender();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('test');
        expect(field.value()).toBe('test');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('maennlich');
        expect(field.value()).toBe('maennlich');
        expect(field.complaint).toBe(false);

        field.validate('weiblich');
        expect(field.value()).toBe('weiblich');
        expect(field.complaint).toBe(false);

        // --- Hook
        field = gender(true, (input) => {
            input = 'divers';
            return input;
        });
        field.validate('bla');
        expect(field.value()).toBe('divers');
    });

    it('should handle & validate phone numbers correctly', () => {
        const {phone} = form;
        let field = phone(true);    // pflicht
        let field2 = phone(false);  // optional

        field.validate('b');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(false);

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(true);

        field.validate('test');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(true);

        field.validate('+49-123');
        expect(field.value()).toBe('+49-123');
        expect(field.complaint).toBe(false);

        // --- Pflichtprüfung
        field2.validate('');
        expect(field2.complaint).toBe(false);
    });

    it('should handle & validate emails correctly', () => {
        const {email, ValidationTypes} = form;
        let field = email(true);    // pflicht
        let field2 = email(false);  // optional

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('123');
        expect(field.value()).toBe('123');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('f.marcus@phoenixreisen.com');
        expect(field.value()).toBe('f.marcus@phoenixreisen.com');
        expect(field.complaint).toBe(false);

        // --- Bestätigungsprüfung - wenn zwei Felder übereinstimmen müssen
        field.mirror = field2;
        field2.validate('f.marvus@phoenixreisen.com');
        field.validate('f.marcus@phoenixreisen.com');
        expect(field.complaint).toBe(ValidationTypes.notequal);

        field2.validate('f.marcus@phoenixreisen.com');
        field.validate('f.marcus@phoenixreisen.com');
        expect(field.complaint).toBe(false);

        // --- Email-Syntax-Check (Validator isEmail())
        const invalides = [
            'fab,mar@phoenix.de',
            'fabian@phoenix,com',
            'fabian.com',
            'fabian@phoenix-com',
            'fabian@phoenix',
        ];
        for(const value of invalides) {
            field2.validate(value);
            expect(field2.value()).toBe(value);
            expect(field2.complaint).toBe(ValidationTypes.invalid);
        }

        // --- Pflichtprüfung
        field2.validate('');
        expect(field2.complaint).toBe(false);
    });

    it('should handle undetermined text input correctly', () => {
        const {text, ValidationTypes} = form;
        let field = text(true);
        let field2 = text(false);

        field.validate('');
        field2.validate('');
        expect(field2.complaint).toBe(false);
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate(' ');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('hallo');
        expect(field.value()).toBe('hallo');
        expect(field.complaint).toBe(false);

        field.mirror = field2;
        field2.validate('phoenix reisen');
        field.validate('phönix reisen');
        expect(field.complaint).toBe(ValidationTypes.notequal);
        field.validate('phoenix reisen');
        expect(field.complaint).toBe(false);
    });

    it('should handle & validate integers correctly', () => {
        const {int, ValidationTypes} = form;
        let field = int();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('123t');
        expect(field.value()).toBe('123t');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('123');
        expect(field.value()).toBe('123');
        expect(field.complaint).toBe(false);
    });

    it('should handle & validate german date inputs correctly', () => {
        const {date, ValidationTypes} = form;
        let field = date(true, ['de']);

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        // VORGABE: TT.MM.JJJJ
        for(const value of ['13.8.2019', '3.10.2019', '13.10.19', '2019-10-03']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBe(ValidationTypes.invalid);
        }
        for(const value of ['04.07.2019']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBe(false);
        }
        // --- Prüfung cast String => Date Object
        const value = field.getDate();
        expect(typeof value).toBe('object');
        expect(value.getFullYear().toString()).toBe('2019');
    });

    it('should handle & validate datepicker dates correctly', () => {
        const required = true;
        const {addDays, format} = datetime;
        const {date, ValidationTypes} = form;
        let rangeField = date(required, ['de'], [new Date(), addDays(new Date, 5)]);
        let field = date(required, ['de', 'en']);
        let field2 = date(!required, ['de']);

        field.validate('');
        field2.validate('');
        expect(field.value()).toBe('');
        expect(field2.value()).toBe('');
        expect(field2.complaint).toBeFalsy();
        expect(field.complaint).toBe(ValidationTypes.empty);

        // VORGABE: TT.MM.JJJJ
        for(const value of ['13.8.2019', '3.10.2019', '13.10.19', '19-10-03', '2019-10-3', '2019-7-10']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBe(ValidationTypes.invalid);
        }
        for(const value of ['04.07.2019', '2019-07-04']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBeFalsy();
        }

        // --- Prüfung Range
        const inRange = format(addDays(new Date(), 2), 'DD.MM.YYYY');
        const outOfRange = format(addDays(new Date(), -2), 'DD.MM.YYYY')
        rangeField.validate(outOfRange);
        expect(rangeField.complaint).toBe(ValidationTypes.outOfRange)
        rangeField.validate(inRange);
        expect(rangeField.complaint).toBeFalsy();

        // --- Prüfung cast String => Date Object
        const value = field.getDate();
        expect(typeof value).toBe('object');
        expect(value.getFullYear().toString()).toBe('2019');
    });

    it('should handle & validate time inputs correctly', () => {
        const {time, ValidationTypes} = form;
        let field = time();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        // VORGABE: hh:mm
        for(const value of ['13.00', '4:00', '4', '12.3', '12:5']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBe(ValidationTypes.invalid);
        }
        for(const value of ['12:00', '04:15', '07:08', '12:05']) {
            field.validate(value);
            expect(field.value()).toBe(value);
            expect(field.complaint).toBe(false);
        }
    });

    it('should handle & validate radio buttons correctly', () => {
        const {radio} = form;
        let field = radio();

        field.validate(null);
        expect(field.value()).toBe(null);
        expect(field.complaint).toBe(true);

        field.validate('option 1');
        expect(field.value()).toBe('option 1');
        expect(field.complaint).toBe(false);
    });

    it('should handle & validate checkboxes correctly', () => {
        const {checkbox} = form;
        let field = checkbox();

        field.validate(null);
        expect(field.value()).toBe(false);
        expect(field.complaint).toBe(true);

        field.validate('option 1');
        expect(field.value()).toBe(true);
        expect(field.complaint).toBe(false);
    });

    it('should handle & validate ibans correctly', () => {
        const {iban, ValidationTypes} = form;
        let field = iban();

        field.validate('');
        expect(field.value()).toBe('');
        expect(field.complaint).toBe(ValidationTypes.empty);

        field.validate('DE02500105170137075031');
        expect(field.value()).toBe('DE02500105170137075031');
        expect(field.complaint).toBe(ValidationTypes.invalid);

        field.validate('DE02500105170137075030');
        expect(field.value()).toBe('DE02500105170137075030');
        expect(field.complaint).toBe(false);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', 'EN02500105170137075030');
        field.format(input);
        expect(field.value()).toContain(' ');                   // in 4er Grüppchen aufgeteilt
        expect(field.complaint).toBe(ValidationTypes.invalid);  // nur DE erlaubt
    });
});