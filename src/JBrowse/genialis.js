import 'babel-polyfill'

// Custom genialis entrypoint is needed because:
// - we load jbrowse asynchronously
// - webpack loads more chunks asynchronously on demand
// - require(jbrowse, dojo, dijit) throws error unless chunks are already loaded
//     https://github.com/OpenNTF/dojo-webpack-plugin#the-global-require-function
// - we don't know when chunks finish loading, and can't force them to load
window.jbrowseGenialisEntry = new Promise((resolve) => {
    require([
        'JBrowse/Browser',
        'dojo',
        'dijit',
        'css!../../css/genome.scss',

        // instruct build/glob-loader.js to insert includes for every bit of JBrowse and plugin code
        //!! glob-loader, please include every JBrowse and plugin module here

    ],
    function (Browser, dojo, dijit) {
        resolve({Browser, dojo, dijit});
    });
});
