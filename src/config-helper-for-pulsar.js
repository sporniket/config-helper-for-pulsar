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

function createHandlerOfDidChange(settingName, settingNameForPulsar, settingsWatchingForChanges, onDidChange = (key, newValue, oldValue, settings) => {}) {
    return ({
        newValue,
        oldValue
    }) => {
        settingsWatchingForChanges[settingName].value = newValue;
        onDidChange(settingName, newValue, oldValue, settingsWatchingForChanges);
    };
}

export function loadAndWatchSettingsFromPulsar(pulsar, prefixOfSettingNamesForPulsar, handlersBySettingName) {
    const settings = config.loadConfigurationMap(Object.getOwnPropertyNames(handlersBySettingName), createConfigValueFromPulsarLoader(pulsar), config.createKeyPrefixer(prefixOfSettingNamesForPulsar));
    const settingsWatchingForChanges = {};
    settings.forEach((value, key, map) => {
        settingsWatchingForChanges[key] = {
            key: value.get('key'),
            value: value.get('value'),
            subscription: pulsar.config.onDidChange(value.get('key'), createHandlerOfDidChange(key, value.get('key'), settingsWatchingForChanges, handlersBySettingName[key]))
        };
    });
    return settingsWatchingForChanges;
}
