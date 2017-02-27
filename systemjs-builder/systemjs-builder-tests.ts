import Builder = require('systemjs-builder');

/*using code examples from https://github.com/systemjs/builder*/

// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('path/to/baseURL', 'path/to/system/config-file.js');

builder
.bundle('local/module.js', 'outfile.js')
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});

builder.config({
  map: {
    'a': 'b.js'
  }
});

//This is an error in SystemJS docs
//builder.build('a');

builder.buildStatic('src/NavBar.js - react', 'dist/NavBarStaticBuild.js', {
  globalName: 'NavBar',
  globalDeps: {
    'react': 'React'
  }
});

builder.bundle('myModule.js', 'outfile.js', { sourceMaps: true, lowResSourceMaps: true, });

builder.bundle('myModule.js', 'outfile.js', { sourceMaps: true, lowResSourceMaps: true });

builder.bundle('asdasd', 'outfile.js', { minify: true, mangle: false, globalDefs: { DEBUG: false } });

builder.bundle('myModule.js', { minify: true }).then(function(output) {
  output.source;    // generated bundle source
  output.sourceMap; // generated bundle source map
  output.modules;   // array of module names defined in the bundle
});

builder.buildStatic('myModule.js', 'outfile.js', { format: 'cjs' });

builder.config({
  meta: {
    'resource/to/ignore.js': {
      build: false
    }
  }
});

var mySource = 'import * from foo; var foo = "bar";'; // get source as a string
builder.bundle('foo.js', {
  fetch: function (load, fetch) {
    if (load.name.indexOf('foo.js') !== -1) {
      return mySource;
    } else {
      // fall back to the normal fetch method
      return fetch(load);
    }
  }
});


builder.bundle('app/* - app/corelibs.js', 'output-file.js', { minify: true, sourceMaps: true });

Promise.all([builder.trace('app/first.js'), builder.trace('app/second.js')])
.then(function(trees) {
  var commonTree = builder.intersectTrees(trees[0], trees[1]);
  return Promise.all([
    builder.bundle(commonTree, 'shared-bundle.js'),
    builder.bundle(builder.subtractTrees(trees[0], commonTree), 'first-bundle.js'),
    builder.bundle(builder.subtractTrees(trees[1], commonTree), 'second-bundle.js')
  ]);
});
