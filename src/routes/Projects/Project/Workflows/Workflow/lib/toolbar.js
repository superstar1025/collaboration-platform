/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2017-12-08


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file. */


window.App = window.App || {};
window.App.config = window.App.config || {};

(() => {

  window.App.config.toolbar = {
    groups: {
      'undo-redo': { index: 1 },
      layout: { index: 7 },
      zoom: { index: 8 },
      grid: { index: 9 },
      snapline: { index: 10 },
    },
    tools: [
      {
        type: 'undo',
        name: 'undo',
        group: 'undo-redo',
        attrs: {
          button: {
            'data-tooltip': 'Undo',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'redo',
        name: 'redo',
        group: 'undo-redo',
        attrs: {
          button: {
            'data-tooltip': 'Redo',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'zoom-to-fit',
        name: 'zoom-to-fit',
        group: 'zoom',
        attrs: {
          button: {
            'data-tooltip': 'Zoom To Fit',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'zoom-out',
        name: 'zoom-out',
        group: 'zoom',
        attrs: {
          button: {
            'data-tooltip': 'Zoom Out',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'label',
        name: 'zoom-slider-label',
        group: 'zoom',
        text: 'Zoom:',
      },
      {
        type: 'zoom-slider',
        name: 'zoom-slider',
        group: 'zoom',
      },
      {
        type: 'zoom-in',
        name: 'zoom-in',
        group: 'zoom',
        attrs: {
          button: {
            'data-tooltip': 'Zoom In',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'separator',
        group: 'grid',
      },
      {
        type: 'label',
        name: 'grid-size-label',
        group: 'grid',
        text: 'Grid size:',
        attrs: {
          label: {
            'data-tooltip': 'Change Grid Size',
            'data-tooltip-position': 'top',
            'data-tooltip-position-selector': '.toolbar-container',
          },
        },
      },
      {
        type: 'range',
        name: 'grid-size',
        group: 'grid',
        text: 'Grid size:',
        min: 1,
        max: 50,
        step: 1,
        value: 10,
      },
    ],
  };
})();
