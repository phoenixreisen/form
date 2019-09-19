# Phoenix Reisen Formular Modul

Wiederverwendbarer Stuff zum vereinfachten Handling reaktiver Formulare - instant Validierung für verschiedene Feldtypen, Validierung für gesamtes Formular, Prüfung auf Browser-Support für Datepicker, und anderes.

## Installation

```bash
npm install --save @phoenixreisen/form
```

## Anwendung (Beispiel)

Konfig & Types importieren:

```js
import { DateConfig, ValidationTypes, UserTypes } from '@phoenixreisen/form';
```

Felder importieren:

```js
// nur bestimmte Felder
import { text, int, email, bookingnr } from '@phoenixreisen/form';
```

Funktionen importieren:

```js
import { isValidInput, isDateSupported } from '@phoenixreisen/form';
```

Formular deklarieren:
(Parameter-Signatur der einzelnen Felder beachten, weitere Beispiele in Ordner `spec`)

```js
const form = {
    prename: text(true, input => {      // Text
        console.log('hooked')
        input = input.trim();
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
{form.surname.complaint && form.surname.complaint === ValidationTypes.empty ?
    <div class="alert alert--warning">
        Bitte ausfüllen
    </div>
}
```

Bei Submit alles validieren lassen:

```js
function submit(form) {
    if(!Form.isValidInput(form)) {
        // bei invaliden Feldern wurde property "complaint" 
        // auf true oder einen der ValidationTypes (string) gesetzt.
        return;
    }
    // code...
}
```


## Deployment

```bash
npm version [major|minor|patch]     # increase version x.x.x => major.minor.patch
npm publish                         # upload to npm
git push
```