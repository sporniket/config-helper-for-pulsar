import * as config from 'config-loader-base-by-sporniket';

/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **config-helper-for-pulsar-by-sporniket**.
NPM library to help an extension to manage a set of configuration settings.
****************************************/
// See https://docs.pulsar-edit.dev/api/pulsar/latest/Config/
// * https://docs.pulsar-edit.dev/api/pulsar/latest/Config/#getting-and-setting-config-settings.
// * https://docs.pulsar-edit.dev/api/pulsar/latest/Config/#instance-ondidchange

function createConfigValueFromPulsarLoader(pulsar) {
    return (key) => pulsar.config.get(key);
}

function createHandlerOfDidChange(settingName, settingNameForPulsar, settingsWatchingForChanges, onDidChange = null) {
    return ({
        newValue,
        oldValue
    }) => {
        settingsWatchingForChanges[settingName].value = newValue;
        if (onDidChange){
            onDidChange(settingName, newValue, oldValue, settingsWatchingForChanges);
        }
    };
}

/**
 * Returns a set of settings loaded from pulsar, that stays in sync with pulsar configuration.
 *
 * Typical use :
 *
 * ```javascript
 * const onDidChangeSpecial = (settingName, newValue, oldValue, settings) => {
 *   console.log(`${settingName} changed from '${oldValue}' to '${newValue}'`);
 *   console.log(`Do something special`);
 *   console.log(`current state of settings : ${JSON.stringify(settings, null, 4)}`);
 * } ;
 * const onDidChangeDefault = (settingName, newValue, oldValue, settings) => {
 *   console.log(`${settingName} changed from '${oldValue}' to '${newValue}'`);
 *   console.log(`Do default behaviour`);
 *   console.log(`current state of settings : ${JSON.stringify(settings, null, 4)}`);
 * } ;
 *
 * const mySettings = loadAndWatchSettingsFromPulsar(
 *   atom,
 *   'my.extension.prefix',
 *   {
 *     a:onDidChangeSpecial,
 *     b:onDidChangeDefault,
 *     c:onDidChangeDefault,
 *     d:null // this extension does nothing when d changes.
 *   }
 * ) ;
 * ```
 *
 * The returned object looks like this :
 *
 * ```javascript
 * {
 *   a: {key:'my.extension.prefix.a', value:'the value', subscription:disposable},
 *   b: {key:'my.extension.prefix.b', value:'the value', subscription:disposable},
 *   c: {key:'my.extension.prefix.c', value:'the value', subscription:disposable},
 *   d: {key:'my.extension.prefix.d', value:'the value', subscription:disposable},
 * }
 * ```
 *
 *
 */
export function loadAndWatchSettingsFromPulsar(pulsar, prefixOfSettingNamesForPulsar, handlersBySettingName) {
    const settings = config.loadConfigurationMap(Object.getOwnPropertyNames(handlersBySettingName), createConfigValueFromPulsarLoader(pulsar), config.createKeyPrefixer(prefixOfSettingNamesForPulsar));
    const settingsWatchingForChanges = {};
    settings.forEach((value, key) => {
        settingsWatchingForChanges[key] = {
            key: value.get('key'),
            value: value.get('value'),
            subscription: pulsar.config.onDidChange(value.get('key'), createHandlerOfDidChange(key, value.get('key'), settingsWatchingForChanges, handlersBySettingName[key]))
        };
    });
    return settingsWatchingForChanges;
}
