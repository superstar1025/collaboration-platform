/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2017-12-08


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file. */

window.App = window.App || {};
window.RAPPID = {
  defaultPaperSize: [1000, 1000],
  shapeSize: [50, 50],
  iconSize: [20, 20],
  shapeMargin: [20, 10],
  shapeTextMarginTop: 10,
  smallAgentTextWidth: 90,
  wfAutoSaveInterval: 100,
  chartPieRadius: 60,
};

export default (_, joint, { agentTypes, configClicked, saveWorkflow, workflowFunctions }) => {

  window.App.MainView = joint.mvc.View.extend({

    className: 'app',

    events: {
      'focus input[type="range"]': 'removeTargetFocus',
      mousedown: 'removeFocus',
      touchstart: 'removeFocus',
    },

    removeTargetFocus(evt) {
      evt.target.blur();
    },

    removeFocus() {
      document.activeElement.blur();
      window.getSelection().removeAllRanges();
    },

    init() {

      this.initializePaper();
      this.initializeStencil();
      this.initializeSelection();
      this.initializeHaloAndInspector();
      this.initializeNavigator();
      // this.initializeToolbar();
      this.initializeKeyboardShortcuts();
      this.initializeTooltips();
      this.initializeWorkflowFunctions();
    },

    // Create a graph, paper and wrap the paper in a PaperScroller.
    initializePaper() {

      this.graph = new joint.dia.Graph();
      const { graph, validateConnection } = this;
      const { defaultPaperSize, chartPieRadius } = window.RAPPID;

      graph.on('add', (cell, collection, opt) => {
        if (opt.stencil) this.createInspector(cell);
      }, this);

      graph.on('remove', (cell) => {
        if (cell instanceof joint.shapes.app.Link && cell.get('target').id && !cell.silent) {
          const link = cell;
          const source = graph.getCell(link.get('source').id);
          const sourceAttr = source.attributes;
          const { groupKey } = link.attributes;
          if (groupKey) {
            sourceAttr.targetIds[groupKey] = _.without(sourceAttr.targetIds[groupKey], link.get('target').id);
          } else {
            sourceAttr.targetIds = _.without(sourceAttr.targetIds, link.get('target').id);
          }
        }
      }, this);


      this.chart = new joint.shapes.chart.Pie({
        attrs: { '.slice-inner-label': { fill: '#000' } },
        position: { x: 0, y: 0 },
        size: {
          width: chartPieRadius * 2,
          height: chartPieRadius * 2,
        },
        serieDefaults: {
          degree: 360,
          startAngle: 0,
          showLegend: false,
        },
        sliceDefaults: { innerLabel: '{label}' },
        series: [],
      });

      this.commandManager = new joint.dia.CommandManager({ graph });

      this.paper = new joint.dia.Paper({
        width: defaultPaperSize[0],
        height: defaultPaperSize[1],
        gridSize: 10,
        drawGrid: true,
        model: graph,
        async: {
          batchSize: 1,
        },
        defaultLink: new joint.shapes.app.Link(),
        linkConnectionPoint: window.joint.util.shapePerimeterConnectionPoint,
        validateConnection,
      });

      const { paper } = this;

      paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
      paper.on('cell:mousewheel', this.onMousewheel, this);

      this.snaplines = new joint.ui.Snaplines({ paper });

      this.paperScroller = new joint.ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab',
      });

      const { paperScroller } = this;

      this.$('.paper-container').append(paperScroller.el);
      paperScroller.render().center();
      // setInterval(() => this.saveGraphAsync(this), wfAutoSaveInterval);
    },

    // Create and populate stencil.
    initializeStencil() {

      const stencilSetting = window.App.config.generateStencil(agentTypes);
      const { shapeSize, shapeMargin, shapeTextMarginTop } = window.RAPPID;
      this.stencil = new joint.ui.Stencil({
        paper: this.paperScroller,
        snaplines: this.snaplines,
        scaleClones: true,
        width: (shapeSize[0] + shapeMargin[0]) * 2,
        groups: stencilSetting.groups,
        dropAnimation: true,
        groupsToggleButtons: true,
        search: {
          '*': ['type', 'attrs/text/text', 'attrs/.label/text'],
        },
        // Remove tooltip definition from clone
        dragStartClone(cell) {
          const cellClone = cell.clone();
          cellClone.attributes.size = {
            width: cellClone.attributes.size.width * 1.6,
            height: cellClone.attributes.size.height * 1.6,
          };
          cellClone.attributes.attrs.text['y-alignment'] = 'end';
          if (cellClone.attributes.agentType === 'Filter') {
            cellClone.attr('text/ref-dy', -30);
          }
          cellClone.attr('image/x', cellClone.attributes.size.width * 0.375);
          cellClone.attr('image/y', 10);
          cellClone.attr('rect/stroke', 'red');
          cellClone.attr('circle/stroke', 'red');
          cellClone.attr('path/stroke', 'red');
          cellClone.attributes.error = ['Validating...'];
          return cellClone.removeAttr('./data-tooltip');
        },
      });

      const { stencil } = this;
      this.$('.stencil-container').append(stencil.render().el);
      const layoutOptions = {
        columns: 3,
        columnWidth: shapeSize[0] + shapeMargin[0],
        rowHeight: (shapeSize[1] * 2) + shapeTextMarginTop,
      };
      window._.each(stencilSetting.groups, (group, name) => {
        stencil.load(stencilSetting.shapes[name], name);
        window.joint.layout.GridLayout.layout(stencil.getGraph(name), layoutOptions);
        stencil.getPaper(name).fitToContent(1, 1, 50);
      });
      this.wrapText(shapeSize);
      // stencil.render().load(stencilSetting.shapes);
    },

    initializeKeyboardShortcuts() {

      this.keyboard = new joint.ui.Keyboard();
      this.keyboard.on({

        'ctrl+z': () => {
          this.commandManager.undo();
          this.selection.cancelSelection();
        },

        'ctrl+y': () => {
          this.commandManager.redo();
          this.selection.cancelSelection();
        },

        'ctrl+plus': (evt) => {
          evt.preventDefault();
          this.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
        },

        'ctrl+minus': (evt) => {
          evt.preventDefault();
          this.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
        },

      }, this);
    },

    initializeSelection() {

      this.clipboard = new joint.ui.Clipboard();
      this.selection = new joint.ui.Selection({
        paper: this.paper,
        handles: window.App.config.selection.handles,
      });

      // Initiate selecting when the user grabs the blank area of the paper
      // while the Shift key is pressed.
      // Otherwise, initiate paper pan.
      this.paper.on('blank:pointerdown', (evt, x, y) => {

        this.paperScroller.startPanning(evt, x, y);

      }, this);

      this.selection.on('selection-box:pointerdown', (elementView, evt) => {

        // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
        if (this.keyboard.isActive('ctrl meta', evt)) {
          this.selection.collection.remove(elementView.model);
        }

      }, this);
    },

    createInspector(cell) {

      return joint.ui.Inspector.create('.inspector-container', _.extend({
        cell,
      }, window.App.config.inspector[cell.get('type')]));
    },

    initializeHaloAndInspector() {

      const events = {
        cellMouseOver: (cellView, e) => {
          const cell = cellView.model;
          if (cell.attributes.type === 'chart.Pie') return e.preventDefault();
          if (this.linkDownFlag || this.agentDownFlag) return e.preventDefault();
          if (cell instanceof window.joint.dia.Link) return e.preventDefault();
          this.mouseOnHandle = true;
          cell.halo = new joint.ui.Halo({
            cellView,
            handles: window.App.config.halo.handles,
            boxContent: false,
          });
          if (cell.attributes.agentType === 'Filter') cell.halo.removeHandle('link');

          const configHandleOptions = { name: 'config', position: 'n' };
          const configIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3wwECAsV5RQSlAAABn1JREFUWMOtl12MZUURx3//6j73zr0zu7ODIrssJLODDBDN7vIAGDWyxtEEUF/A+GDCI348GEWfwIAG0PiAJMSgr5po4osakjVEwK9EDPjAh9Gwuw4fsrgoCO7szNyPc06VD/fe2Zk7d1ggdtLpU3266l9dXdXVpaWlIwaIYTNgFeJQyBbBuqI8EopusHcarhN8AjgcsB+YHvKuCU4BzwQ8vA5HL0MnfynXOhQnwf+k8N0gZ0sLLS0dSSMFhuBcFbK9EB8PlatwRQu+IrjJI84DQpIMkAZ6RwQ+GAOQSSvAgx24993oqV/J8ylIjyvqNhCbFEgLC/MGyIA14NpQeiRR3lhTzEj3NODHEXGVpFY7Z99TFDFXFJprFNpTFMwO+0xKMZWSS6KMmPKIgw3plj7sm4Xff6mT118sojghothkgrSwMG8GWgWWQuluV+99wcJ50kPATUDMFoVf0GxqriisnbMVkpKEJGzYCzO1crZdOWsm55BU99wBrm6hG18o4g/Xh/3zDVE8K6I5tER678K8dUBHQukut95j4nAT/cYjLm2alfumptJco5GSJB8yjTrSoI/NZ0kzOVs7JfXc69L9/Cx97jXx2CdDz70qiuMiGoBVwKGQ3V2m3h8VlxRw1CP2TudcXdxuFa2UVA/PeNQ2PLaqoCoh4uwc4EAdwZSZLm618q6iqD1id4YH/yauvLO23tWh1AdsP/CUwn+W6mYDfuIRF07nXF04NZWF8M2Aw+9wR4DNzmJ75pAZUdfb1o2U3tdspqESsxl++qj53L25LhcD5cOh9H23/jHFNwOuaZiVe5vNYmRWbRo3t/Ztt1EcOkS4Uy8vs3bnnURVIWnjKEa8AHubzVS5V133y3ej76z1iy/cb57tVrf+XxSXA7cCXNBs5jwUogmCwh212+TLLkOtFpqeJi8uot27oa43fGLSBt7TbGYNyM8/rbjmq259e0FBA77oEa1dOVftnFTvAP52msZkODCVErNF4R5Bhi+/LrCTcD5wk0nsKYoUsVXIOLjMiPV1qmPHiG4X1tepTpwgVlYgpS0OGWOjRzBbZEsDK93wPHFJbsKSR1zYzsmnzMzHmMaVGQlf+/Y9qNUeEN0OUftAuZ0UH841ZGqn5GeqaraQbjDBxwDaKcfoatUE5slGnqxtjK3arJAE7ZxH/5YycCUSTTPF0P4xAWY8EqZvv53i0CFwp1peZu2OO7ZEwTjvhnIBTTMN1x20gIuMwe210x63CBhFweIimpqCdpt86aXbomAS74hOw2QG7DNglwCTFOcA37KNqhr8cyeqajD3Jrybd2cDPICGvdnp7iRgcw44S7+5H+zUDDgTgEeE3oGAiQY6x2Z8gAfQN8FJB6o4a8O3fBQT7XZuS9YRMQz3UwY8SQQ9921h+NbBt6/aiVeCntcRgwvrGQt4FGC9riaG4Tu9hne0ZMB6VY/+P2I9eMSkl7u1W9c9bBPD/8sPRrSAfnis17WZdLqEo3YRvAr83CP4b1nWmoC0bSpiS9gN6J3BR/wmcbqsvB7wHj2Alm0+RA8eMKlzpqryWlVHYvvNt0WoBDkPn9KGct4almPgwSDcunXN6bI0k6jg/vMC7D7zxkH0LPA9gH/3elVF7JiOt2TDTodYW9uWDcfBR+O/er0qBuQPD6LH7zNv6OalI+mY4GuVinnpdx5xzehJxgQlRk8yzLCZGZCI1dVBHkhp6zrOJqNTvV59piyTSc+uEB9catSnbynN0rsW5u1wKH29Tr0XLH6bpc/03Wd77tVMTmZoQigNX8KdDtHtANpIxZvbyKFf6XXrM2WVTFop4VPXhj2/Gmr8Vbhl4GmFfyPXzQ+Flku4zqRX1qoqv7TeKTt1HUli8529AZQz5GJghTHgJNF1j5c6nWoEXsGnrwie/JZ58wlFXQDpwMK8NUDHRbwoipvdXn5O/KKQPlLD/pWq8tLdCzMVkkzaMOvI1OJsghHQd4/Xy7J+tdejisgmHe/DdYvBEw9YNH89LNGcYWUUoCZwTMSyKO7K8Z8POz+aQQ3BB7p1XZypKnXcvYrwAMUAixgK6rvHalX562XJa/2+derahkf1gzeIz360l/7x3cKbjyrq1maf2qk43Q+xFCpX4PIW3Cq48e0Wp124d0566iE8nwJ7XOHjxakmledrwPsDLSI7gMqFIN6AC9pwvZ2jPHd4uANH23Dy7xY6FRQvgv9ZEbuA8fL8f40EPnOmwLnoAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTEyLTA0VDA4OjExOjIxLTA1OjAwhYihSgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0xMi0wNFQwODoxMToyMS0wNTowMPTVGfYAAAAASUVORK5CYII=';
          const configIconGreen = 'data:image/png;base64,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';
          if (!_.get(cell, 'attributes.error.length')) {
            configHandleOptions.icon = configIconGreen;
          } else {
            configHandleOptions.icon = configIcon;
            configHandleOptions.attrs = {
              '.handle': {
                'data-tooltip-class-name': 'small',
                'data-tooltip': (cell.attributes.error || []).join('<br />'),
                'data-tooltip-position': 'bottom',
                'data-tooltip-padding': 15,
              },
            };
          }
          cell.halo.addHandle(configHandleOptions);
          cell.halo.render();

          // action links
          cell.halo.on('action:link:add', (link) => {
            cell.halo.remove();
            this.linkDownFlag = false;
            const sourceId = link.get('source').id;
            const targetId = link.get('target').id;
            const source = this.graph.getCell(sourceId);
            const sourceAttr = source.attributes;
            const activeSliceIndex = this.chart.prop('active-slice');
            this.chart.remove();
            const agentType = agentTypes.find(type => type.config.type === sourceAttr.agentType);
            let targets = [];
            if (_.get(agentType, 'config.event_groups.length')) {
              const chartData = this.chart.get('series')[0].data[activeSliceIndex];
              if (!chartData) {
                link.remove();
              } else {
                const { group_key: groupKey } = chartData;
                link.label(0, { position: 0.5, attrs: { text: { text: chartData.label } } });
                const { attributes } = link;
                attributes.groupKey = groupKey;
                sourceAttr.targetIds = sourceAttr.targetIds || {};
                sourceAttr.targetIds[groupKey] = sourceAttr.targetIds[groupKey] || [];
                targets = sourceAttr.targetIds[groupKey];
              }
            } else {
              sourceAttr.targetIds = sourceAttr.targetIds || [];
              targets = sourceAttr.targetIds;
            }
            if (!sourceId || !targetId || targets.indexOf(targetId) > -1) {
              const cell = link;
              cell.silent = true;
              link.remove();
            } else {
              targets.push(targetId);
            }
            // chart.prop 'active-slice', undefined

            // if targetId
            //  paper.trigger 'cell:mouseover', paper.findViewByModel(graph.getCell(targetId))
          });
          cell.halo.on('action:link:pointerdown', () => {
            this.linkDownFlag = true;
            const bbox = cell.getBBox();
            // Display pie chart
            const displayChart = (paramSerieData) => {
              const { chartPieRadius } = window.RAPPID;
              const { chart } = this;
              chart.prop('position', { x: (bbox.x + bbox.width) - chartPieRadius, y: (bbox.y + (bbox.height / 2)) - chartPieRadius });
              // chart.prop('position', { x: 300, y: 500 });
              chart.prop('series', [{ data: paramSerieData }]);
              chart.prop('active-slice', undefined);
              // console.log(paramSerieData, chart);
              this.graph.addCell(chart);
              chart.toFront();
              const chartView = this.paper.findViewByModel(chart);
              const $chartViewDataEl = chartView.$('.data');
              this.$('.slice-inner-label', $chartViewDataEl).css('display', 'none');
              chartView.$('.slice-inner-label').each((index, element) => {
                const $textEl = this.$(element);
                $textEl.attr('data-slice', $textEl.parents('.slice').attr('data-slice'));
                $textEl.appendTo($chartViewDataEl);
              });
              chartView.on('mouseover', (slice) => {
                const $slice = this.$(`.slice[data-serie="${slice.serieIndex}"][data-slice="${slice.sliceIndex}"]`, $chartViewDataEl);
                const elSlice = joint.V($slice[0]);
                _.each(this.$('.slice', $chartViewDataEl), slice => joint.V(slice).scale(1));
                this.$('.slice-inner-label', $chartViewDataEl).css('display', 'none');
                elSlice.scale(1.2);
                chart.prop('active-slice', slice.sliceIndex);
                this.$(`.slice-inner-label[data-slice="${slice.sliceIndex}"]`, $chartViewDataEl).css('display', 'block');
              });
            };
            const agentType = agentTypes.find(type =>
              type.config.type === cell.attributes.agentType);
            const eventGroups = agentType.config.event_groups;
            if (eventGroups) {
              const pieSeries = eventGroups.map(({ pie_value, ...eventGroup }) => ({
                ...eventGroup,
                value: pie_value,
              }));
              displayChart(pieSeries);
            }
          });
          cell.halo.on('action:config:pointerdown', () => {
            configClicked(cell.attributes.agentType, cell.attributes.config, (updatedConfig) => {
              cell.attributes.config = updatedConfig;
              cell.attributes.config.isValid = true;
              this.saveGraphAsync();
            });
          });
          this.leaveTimer = null;
          return true;
        },
      };

      this.paper.on('cell:mouseenter', events.cellMouseOver, this);

      this.paper.on('cell:mouseleave', (cellView) => {
        if (this.linkDownFlag || this.agentDownFlag) return;
        const cell = cellView.model;
        this.mouseOnHandle = false;
        this.cell = cell;
        setTimeout(() => this.mouseOnHandle || (cell.halo && cell.halo.remove()), 10);
      });

      this.paper.$el.on('mouseenter', '.handle', () => {
        this.mouseOnHandle = true;
      });

      this.paper.$el.on('mouseleave', '.handle', () => {
        if (this.linkDownFlag || this.agentDownFlag) return;
        this.mouseOnHandle = false;
        setTimeout(() => this.mouseOnHandle || (this.cell.halo && this.cell.halo.remove()), 10);
      });

      this.paper.on('cell:pointerdown', ({ model }) => {
        this.agentDownFlag = true;
        if (!model.isElement()) return;
        model.halo.remove();
      });
      this.paper.on('cell:pointerup', (cellView) => {
        this.agentDownFlag = false;
        if (!cellView.model.isElement()) return;
        events.cellMouseOver(cellView);
      });
      this.paper.$el.mouseup(() => {
        this.saveGraphAsync();
      });
    },

    initializeNavigator() {

      this.navigator = new joint.ui.Navigator({
        width: 240,
        height: 115,
        paperScroller: this.paperScroller,
        zoom: false,
      });

      const { navigator } = this;

      this.$('.navigator-container').append(navigator.el);
      navigator.render();
    },

    initializeToolbar() {

      this.toolbar = new joint.ui.Toolbar({
        groups: window.App.config.toolbar.groups,
        tools: window.App.config.toolbar.tools,
        references: {
          paperScroller: this.paperScroller,
          commandManager: this.commandManager,
        },
      });

      const { toolbar } = this;

      toolbar.on({
        'svg:pointerclick': _.bind(this.openAsSVG, this),
        'png:pointerclick': _.bind(this.openAsPNG, this),
        'to-front:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toFront'),
        'to-back:pointerclick': _.bind(this.selection.collection.invoke, this.selection.collection, 'toBack'),
        'layout:pointerclick': _.bind(this.layoutDirectedGraph, this),
        'snapline:change': _.bind(this.changeSnapLines, this),
        'clear:pointerclick': _.bind(this.graph.clear, this.graph),
        'print:pointerclick': _.bind(this.paper.print, this.paper),
        'grid-size:change': _.bind(this.paper.setGridSize, this.paper),
      });

      this.$('.toolbar-container').append(toolbar.el);
      toolbar.render();
    },

    changeSnapLines(checked) {

      if (checked) {
        this.snaplines.startListening();
        this.stencil.options.snaplines = this.snaplines;
      } else {
        this.snaplines.stopListening();
        this.stencil.options.snaplines = null;
      }
    },

    initializeTooltips() {

      const tooltip = new joint.ui.Tooltip({
        rootTarget: document.body,
        target: '[data-tooltip]',
        direction: 'auto',
        padding: 10,
      });
      return tooltip;
    },

    exportStylesheet: [
      '.scalable * { vector-effect: non-scaling-stroke }',
      '.marker-arrowheads { display:none }',
      '.marker-vertices { display:none }',
      '.link-tools { display:none }',
    ].join(''),

    openAsSVG() {

      this.paper.toSVG((svg) => {
        new joint.ui.Lightbox({
          title: '(Right-click, and use "Save As" to save the diagram in SVG format)',
          image: `data:image/svg+xml,${encodeURIComponent(svg)}`,
        }).open();
      }, {
        preserveDimensions: true,
        convertImagesToDataUris: true,
        useComputedStyles: false,
        stylesheet: this.exportStylesheet,
      });
    },

    openAsPNG() {

      this.paper.toPNG((dataURL) => {
        new joint.ui.Lightbox({
          title: '(Right-click, and use "Save As" to save the diagram in PNG format)',
          image: dataURL,
        }).open();
      }, {
        padding: 10,
        useComputedStyles: false,
        stylesheet: this.exportStylesheet,
      });
    },

    onMousewheel(cellView, evt, x, y, delta) {

      if (this.keyboard.isActive('alt', evt)) {
        evt.preventDefault();
        this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox: x, oy: y });
      }
    },

    layoutDirectedGraph() {

      joint.layout.DirectedGraph.layout(this.graph, {
        setLinkVertices: true,
        rankDir: 'TB',
        marginX: 100,
        marginY: 100,
      });

      this.paperScroller.centerContent();
    },

    /*
    getWordWrapText()
    @param String text
    @param Object options
    */
    getWordWrapText(text, options) {
      const lines = window.joint.util.breakText(text, options).split('\n');
      let textContent = '';
      lines.forEach((line, i) => {
        textContent += `<tspan dy='${i > 0 ? 1 : 0}em' x='0' class='v-line'>${line}</tspan>`;
      });
      return textContent;
    },

    /*
    wrapText(): Wrap texts in SVG using joint.util.breakText
    @param Array size
    @param Bool isOnPaper
    */
    wrapText(size, isOnPaper) {
      const { $ } = window;
      const { shapeTextMarginTop } = window.RAPPID;
      const { graph } = this;
      if (isOnPaper) {
        // Yes, it's on the paper
        $('.wrap').each((text) => {
          const $this = $(text);
          const klass = $this.attr('class');
          const model = graph.getCell($this.parents('[model-id]').attr('model-id'));
          const modelText = model && model.attributes.textRaw;
          if (!model) return;
          model.attributes.attrs.text.text = modelText;
          $this.html(this.getWordWrapText(modelText, { width: size[0] }));
          $this.attr('fill', '#000').attr('font-size', '14');
          $this.attr('transform', `translate(${undefined}, ${size[1] / 2})`);
          $this.attr('class', klass.replace(/\bwrap\b/, ''));
        });
      } else {
        // No, it's not on the paper. Then it must be on the stencil.
        $('.wrap').each((index, text) => {
          const $this = $(text);
          const klass = $this.attr('class');
          $this.attr('transform', `translate(${size[0] / 2}, ${size[1] + shapeTextMarginTop})`);
          $this.attr('class', klass.replace(/\bwrap\b/, ''));
        });
      }
    },

    /*
    saveGraphAsync()
    */
    saveGraphAsync() {
      const { graph, paper, paperScroller } = this;
      const { wfAutoSaveInterval } = window.RAPPID;
      const { defaultPaperSize } = window.RAPPID;
      setTimeout(() => {
        const workflowDraft = graph.toJSON();
        const { _sx: sx, _sy: sy } = paperScroller;
        workflowDraft.options = {
          paperWidth: defaultPaperSize[0],
          paperHeight: defaultPaperSize[1],
          paperOrigin: { x: 0, y: 0 },
        };
        if (paper && paperScroller) {
          workflowDraft.options = {
            paperWidth: paper.options.width / sx,
            paperHeight: paper.options.height / sy,
            paperOrigin: {
              x: paper.options.origin.x / sx,
              y: paper.options.origin.y / sy,
            },
          };
        }
        saveWorkflow(workflowDraft);
      }, wfAutoSaveInterval);
    },

    validateConnection(cellViewS, magnetS, cellViewT) {
      if (cellViewT.model.attributes.type === 'chart.Pie') return false;
      if (cellViewS.model.id === cellViewT.model.id) return false;
      if (!cellViewT.model.isElement()) return false;
      if (cellViewT.model.attributes.cannot_receive_events) return false;
      return true;
    },

    initializeWorkflowFunctions() {
      const functions = workflowFunctions;
      functions.showErrors = (errors) => {
        const cells = this.graph.getElements();
        cells.forEach((cell) => {
          const cellErrors = errors[cell.id];
          const selectedCell = cell;
          selectedCell.attributes.error = cellErrors || [];
          if (cell.attributes.attrs.rect
            || cell.attributes.attrs.circle
            || cell.attributes.attrs.path
          ) {
            const attribute = ({
              'custom.CircleEx': 'circle',
              'custom.RectEx': 'rect',
              'custom.PathEx': 'path',
            })[cell.attributes.type];
            cell.attr(`${attribute}/stroke`, cellErrors && cellErrors.length ? 'red' : 'transparent');
          }
        });
      };
      functions.openAsPNG = this.openAsPNG.bind(this);
    },
  });
};
