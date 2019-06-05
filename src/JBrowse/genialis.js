import 'babel-polyfill'

/*
How to build custom dist with plugin, public path, and entrypoint:

git clone https://github.com/gmod/jbrowse
cd jbrowse
git checkout 1.16.8-release
download https://github.com/elsiklab/sashimiplot, put into plugins, rename SashimiPlot
npm install yarn
npx yarn
add genialis-browser entrypoint
JBROWSE_BUILD_MIN=1 JBROWSE_PUBLIC_PATH="jspm_packages/github/genialis/jbrowse-built@1.16.8-with-sashimi-plot-public-path-genialis-entry/dist/" npx webpack

push built version to genialis/jbrowse-built
add a tag
jspm install jbrowse=github:genialis/jbrowse-built@1.16.8-with-sashimi-plot-public-path-genialis-entry
*/


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
