import {DateField, Field, Hook, PhonePrefix} from './types'

//--- Funktionen -----

/**
  * Gibt die jeweilige Status-CSS-Klasse für den Submit-Button zurück.
  * @deprecated (aufgrund "Notification" Komponente)
  */
export function getBtnStatusClass(success: boolean, error: Error | boolean): string {
    let classname = '';
    classname = success ? 'btn--success' : classname;
    classname = error ? 'btn--danger' : classname;
    return classname;
}

/**
  * Ruft die validate()-Funktionen aller Felder auf und prüft anschließend,
  * ob alle valide sind. Gut, um ein ganzes Formular vor Submit zu prüfen.
  */
export function isValidInput(fields: {[name: string]: Field<any>|DateField}): boolean {
    let hasErrors = false;
    const fieldnames: Array<string> = Object.keys(fields);
    for(let i=0; i < fieldnames.length; i+=1) {
        const field = fields[fieldnames[i]];
        field.validate(field.value());
        hasErrors = field.complaint
          ? true
          : hasErrors;
    }
    return !hasErrors;
}

/**
 * Prüft, ob der übergebene String eine gültige Ländervorwahl enthält.
 * Liste von Vorwahlen in (extra zu importierenden) "prefixes.json" hinterlegt.
 */
export function hasValidPhoneNrPrefix(phonenr: string, prefixes: Array<PhonePrefix>): boolean {
  if(phonenr?.length) {
      if(phonenr.substring(0, 1) !== '+') {
          return false;
      }
      for(const current of prefixes) {
          const length = current.prefix.string.length;
          const substr = phonenr.slice(0, length);
          const afterSub = phonenr.slice(length, (length+1));
          if(substr === current.prefix.string && afterSub !== '0') {
              return true;
          }
      }
      return false;
  }
  return true;
}

/**
 * Prüft, ob der Browser einen eigenen
 * nativen Datepicker mitbringt oder nicht.
 */
export function isDateSupported(): boolean {
    const value = 'test';
    const input = document.createElement('input');
    input.setAttribute('type', 'date');
    input.setAttribute('value', value);
    return (input.value !== value);
}

/**
 * Ruft die Hook-Funktion eines Feldes auf,
 * sofern eine übergeben wurde.
 */
export function callHook(input: any, field: Field<any>, hook?: Hook): any {
    const hooked = (hook && hook(input, field));
    return (hooked !== null && hooked !== undefined)
        ? hooked
        : input;
}