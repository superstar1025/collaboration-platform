/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2017-12-08


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file. */

window.App = window.App || {};
window.App.config = window.App.config || {};

window.App.config.generateStencil = (agentTypes) => {
  (() => {
    window.joint.shapes.custom = {};
    window.joint.shapes.custom.CircleEx = window.joint.shapes.basic.Circle.extend({
      markup: '<g class="scalable"><circle/></g><image/><text/>',
      defaults: window.joint.util.deepSupplement({
        type: 'custom.CircleEx',
        ...window.joint.shapes.basic.Circle.prototype.defaults,
      }),
    });
    window.joint.shapes.custom.RectEx = window.joint.shapes.basic.Rect.extend({
      markup: '<g class="scalable"><rect/></g><image/><text/>',
      defaults: window.joint.util.deepSupplement({
        type: 'custom.RectEx',
        ...window.joint.shapes.basic.Rect.prototype.defaults,
      }),
    });
    window.joint.shapes.custom.PathEx = window.joint.shapes.basic.Path.extend({
      markup: '<g class="scalable"><path/></g><image/><text/>',
      defaults: window.joint.util.deepSupplement({
        type: 'custom.PathEx',
        ...window.joint.shapes.basic.Path.prototype.defaults,
      }),
    });
  })();

  const groups = {
    trigger: { index: 1, label: 'Triggers' },
    action: { index: 2, label: 'Actions' },
    filter: { index: 3, label: 'Filters' },
  };
  const triggers = agentTypes.filter(({ config: { category } }) => category === 'trigger');
  const actions = agentTypes.filter(({ config: { category } }) => category === 'action');
  const filters = agentTypes.filter(({ config: { category } }) => category === 'filter');
  const { shapeSize, iconSize, smallAgentTextWidth } = window.RAPPID;
  const shapes = {
    trigger: triggers.map(({ config }) => new window.joint.shapes.custom.CircleEx({
      type: 'custom.CircleEx',
      size: { width: shapeSize[0], height: shapeSize[1] },
      attrs: {
        circle: {
          fill: config.color,
          stroke: config.color,
        },
        image: {
          'xlink:href': config.image,
          x: (shapeSize[0] - iconSize[0]) / 2,
          y: (shapeSize[1] - iconSize[1]) / 2,
          width: iconSize[0],
          height: iconSize[1],
        },
        text: {
          text: window.joint.util.breakText(config.type, {
            width: smallAgentTextWidth,
          }),
          fill: 'white',
          fontSize: 12,
          class: 'title wrap',
        },
      },
      cannot_receive_events: true,
      agentType: config.type,
      config: {},
    })),
    action: actions.map(({ config }) => new window.joint.shapes.custom.RectEx({
      type: 'custom.RectEx',
      size: { width: shapeSize[0], height: shapeSize[1] },
      attrs: {
        rect: {
          fill: config.color,
          stroke: config.color,
          rx: 10,
          ry: 5,
        },
        image: {
          'xlink:href': config.image,
          x: (shapeSize[0] - iconSize[0]) / 2,
          y: (shapeSize[1] - iconSize[1]) / 2,
          width: iconSize[0],
          height: iconSize[1],
        },
        text: {
          text: window.joint.util.breakText(config.type, {
            width: smallAgentTextWidth,
          }),
          fill: 'white',
          fontSize: 12,
          class: 'title wrap',
        },
      },
      agentType: config.type,
      config: {},
    })),
    filter: filters.map(({ config }) => new window.joint.shapes.custom.PathEx({
      type: 'custom.PathEx',
      size: { width: shapeSize[0] * 1.155, height: shapeSize[1] },
      attrs: {
        path: {
          // d: 'M 10 0 L 24.14 0 34.14 10 34.14 24.14 24.14 34.14 10 34.14 0 24.14 0 10 z',
          d: 'M 300 130 L 225 260 75 260 0 130 75 0 225 0 z',
          fill: config.color,
          stroke: config.color,
        },
        image: {
          'xlink:href': config.image,
          x: ((shapeSize[0] * 1.155) - iconSize[0]) / 2,
          y: (shapeSize[1] - iconSize[1]) / 2,
          width: iconSize[0],
          height: iconSize[1],
        },
        text: {
          text: window.joint.util.breakText(config.type, {
            width: smallAgentTextWidth,
          }),
          fill: 'white',
          fontSize: 12,
          class: 'title wrap',
        },
      },
      config: {},
      agentType: config.type,
    })),
  };
  return { groups, shapes };
};
