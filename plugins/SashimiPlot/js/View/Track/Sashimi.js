define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'SashimiPlot/Store/SeqFeature/Sashimi',
    'SashimiPlot/View/Dialog/ReadDepthDialog',
    'JBrowse/View/Track/CanvasFeatures',
    'JBrowse/Store/SeqFeature/BAM',
    'JBrowse/Util'
],
function(
    declare,
    array,
    lang,
    SashimiStore,
    ReadDepthDialog,
    CanvasFeatures,
    BAM,
    Util
) {
    return declare(CanvasFeatures, {
        constructor: function() {
            var thisB = this;
            if (this.store.isInstanceOf(BAM)) {
                this.store = new SashimiStore({
                    store: this.store,
                    browser: this.browser,
                    filter: function(f) {
                        return thisB.filterFeature(f);
                    }
                });
            }
        },
        _defaultConfig: function() {
            return Util.deepUpdate(
lang.clone(this.inherited(arguments)),
                {
                    glyph: 'SashimiPlot/View/FeatureGlyph/SashimiArc',
                    useXSOption: true,
                    useXS: false,
                    maxHeight: 100
                });
        },

        _trackMenuOptions: function() {
            var track = this;
            var options = this.inherited(arguments);
            options.push({
                label: 'Filter depth',
                onClick: function() {
                    new ReadDepthDialog({
                        setCallback: function(filterInt) {
                            track.config.readDepthFilter = filterInt;
                            track.browser.publish('/jbrowse/v1/c/tracks/replace', [track.config]);
                        },
                        readDepthFilter: track.config.readDepthFilter || 0
                    }).show();
                }
            });
            if (this.config.useXSOption) {
                options.push({
                    label: 'Use XS',
                    type: 'dijit/CheckedMenuItem',
                    checked: this.config.useXS,
                    onClick: function() {
                        track.config.useXS = this.get('checked');
                        track.browser.publish('/jbrowse/v1/v/tracks/replace', [track.config]);
                    }
                });
            }

            return options;
        },
        _getLayout: function() {
            var layout = this.inherited(arguments);
            return declare.safeMixin(layout, {
                addRect: function(id, left, right, height, data) {
                    this.pTotalHeight = Math.min(
                        Math.max(10 * Math.log(data.get('end') - data.get('start')), this.pTotalHeight),
                        this.maxHeight
                    );
                    return 0;
                }
            });
        }
    });
});
