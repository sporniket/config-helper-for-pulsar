# Config helper for pulsar

> [WARNING] Please read carefully this note before using this project. It contains important facts.

Content

1. What is **Config helper for pulsar**, and when to use it ?
2. What should you know before using **Config helper for pulsar** ?
3. How to use **Config helper for pulsar** ?
4. Known issues
5. Miscellanous

## 1. What is **Config helper for pulsar**, and when to use it ?

**Config helper for pulsar** is a NPM library to help an extension to manage a set of configuration settings.

Typical use

```javascript

// During the initialisation of the extension
const onDidChangeSpecial = (settingName, newValue, oldValue, settings) => {
  console.log(`${settingName} changed from '${oldValue}' to '${newValue}'`);
  console.log(`Do something special`);
  console.log(`current state of settings : ${JSON.stringify(settings, null, 4)}`);
} ;
const onDidChangeDefault = (settingName, newValue, oldValue, settings) => {
  console.log(`${settingName} changed from '${oldValue}' to '${newValue}'`);
  console.log(`Do default behaviour`);
  console.log(`current state of settings : ${JSON.stringify(settings, null, 4)}`);
} ;

const mySettings = loadAndWatchSettingsFromPulsar(
  atom,
  'my.extension.prefix',
  {
    a:onDidChangeSpecial,
    b:onDidChangeDefault,
    c:onDidChangeDefault,
    d:null // this extension does nothing when d changes.
  }
) ;

// Using the values
doSomethingWith(settings.a.value) ;

// During the shutdown of the extension
disposeSettings(settings);
```

### What's new in v0.0.1

* Initial release

### Licence
 **Config helper for pulsar** is free software: you can redistribute it and/or modify it under the terms of the
 GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 option) any later version.

 **Config helper for pulsar** is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
 more details.

 You should have received a copy of the GNU Lesser General Public License along with **Config helper for pulsar**.
 If not, see http://www.gnu.org/licenses/ .


## 2. What should you know before using **Config helper for pulsar** ?

> Do not use **Config helper for pulsar** if this project is not suitable for your project

## 3. How to use **Config helper for pulsar** ?

### npm

```
npm install config-helper-for-pulsar-by-sporniket
```

### Directions and sample code

You may read the test suite to see how it can be used.

## 4. Known issues

See the [project issues](https://github.com/sporniket/config-helper-for-pulsar/issues) page.

## 5. Miscellanous

### Report issues

Use the [project issues](https://github.com/sporniket/config-helper-for-pulsar/issues) page.
