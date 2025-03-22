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

test('disposeSettings should dispose of subscription and clear the settings container.', () => {
    const subscriptionA = {
        dispose: jest.fn()
    };
    const subscriptionB = {
        dispose: jest.fn()
    };
    const settings = {
        a: {key: 'c.a', value: 'value of c.a', subscription: subscriptionA},
        b: {key: 'c.b', value: 'value of c.b', subscription: subscriptionB},
    };
    config.disposeSettings(settings);

    expect(settings).toEqual({});

    expect(subscriptionA.dispose).toHaveBeenCalled();
    expect(subscriptionB.dispose).toHaveBeenCalled();
});
