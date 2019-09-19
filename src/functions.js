export {
    isValidInput,
    isDateSupported,
    getBtnStatusClass,
}

// FUNKTIONEN ----------------------------------------------

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