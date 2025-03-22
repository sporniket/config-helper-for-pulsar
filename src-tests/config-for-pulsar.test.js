import {jest} from '@jest/globals';

import * as config from '../src/config-helper-for-pulsar.js';

/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **config-helper-for-pulsar-by-sporniket**.
NPM library to help an extension to manage a set of configuration settings.
****************************************/

const pulsar = {
    config: {
        _settings: new Map([['c.a','value of c.a'],['c.b','value of c.b']]),
        _subscribersOfDidChange: new Map(),
        get: function (x){return this._settings.get(x)},
        onDidChange: function (settingName, handler){
            this._subscribersOfDidChange.set(settingName, handler)
            return `subscription of ${settingName}`;
        },
        // custom api for testing
        change: function (settingName, newValue) {
            const oldValue = this.get(settingName);
            this._settings.set(settingName, newValue);
            if (this._subscribersOfDidChange.has(settingName)) {
                this._subscribersOfDidChange.get(settingName)({newValue, oldValue}) ;
            }
        },
    }
};

const onDidChangeA = jest.fn()
const onDidChangeB = jest.fn()

test('loadAndWatchSettingsFromPulsar should load configuration and setup watchers for changes', () => {
    const settings = config.loadAndWatchSettingsFromPulsar(pulsar, 'c', {a: onDidChangeA, b: onDidChangeB});
    expect(settings).toEqual(
        {
            a:{key:'c.a', value:'value of c.a', subscription:'subscription of c.a'},
            b:{key:'c.b', value:'value of c.b', subscription:'subscription of c.b'},
        }
    );

    // change setting a
    pulsar.config.change('c.a','a new value for c.a');
    expect(settings.a.value).toBe('a new value for c.a');
    expect(onDidChangeA).toHaveBeenLastCalledWith('a','a new value for c.a','value of c.a',settings)
    expect(settings.b.value).toBe('value of c.b');
    expect(onDidChangeB).not.toHaveBeenCalled();
    // ---

    onDidChangeA.mockClear();
    onDidChangeB.mockClear();

    // change setting b
    pulsar.config.change('c.b','a new value for c.b');
    expect(settings.a.value).toBe('a new value for c.a');
    expect(onDidChangeA).not.toHaveBeenCalled();
    expect(settings.b.value).toBe('a new value for c.b');
    expect(onDidChangeB).toHaveBeenLastCalledWith('b','a new value for c.b','value of c.b',settings)
    // ---
});
