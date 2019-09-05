# Phoenix Reisen Formular Modul

Wiederverwendbarer Stuff zum vereinfachten Handling reaktiver Formulare - instant Validierung für verschiedene Feldtypen, Validierung für gesamtes Formular, Prüfung auf Browser-Support für Datepicker, und anderes.

## Installation

```bash
npm install --save @phoenixreisen/form
```

## Anwendung (Beispiel)

Bestimmte Felder importieren:

```js
import { text, int, email, bookingnr } from '@phoenixreisen/form';
```

Alle Felder importieren:

```js
import fields from '@phoenixreisen/form';
```

Funktionen importieren:

```js
import { isValidInput, isDateSupported } from '@phoenixreisen/form';
```

Formular deklarieren:
(Parameter-Signatur der einzelnen Felder beachten)

```js
const form = {
    prename: text(true, input => {    // Text
        console.log('hooked')
        input = parseInt(input, 10);
        return input;
    }),
    surname: text(),                    // Text
    age: int(false),                    // optionales Feld, Int Validierung
    bookingnr: bookingnr()              // Validierung auf gültige Buchungsnr.
};
```

Form-Feld an ein bestimmtes HTML-Feld binden:

```html
<input 
    type="text"
    placeholder="Beispiel..."
    value={form.surname.value()}
    oninput={e => form.surname.validate(e.target.value)}
/>

{form.surname.complaint &&
    <div class="alert alert--warning">
        Bitte richtig ausfüllen
    </div>
}
```

Bei Submit alles validieren lassen:

```js
function submit(form) {
    if(!Form.isValidInput(form)) {
        // bei invaliden Feldern wurde property "complaint" auf true gesetzt.
        return;
    }
    // code...
}
```


## Deployment

```bash

npm version [major|minor|patch]     # increase version x.x.x => major.minor.patch
npm publish                         # upload to npm

hg bzw. git commit package.json package-lock.json -m "(npm) Neue Version"
hg bzw. git push
```