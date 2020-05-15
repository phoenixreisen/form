import {Field} from './fields'

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
export function isValidInput(fields: {[name: string]: Field<any>}): boolean {
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