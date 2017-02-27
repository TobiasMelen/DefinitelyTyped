// Type definitions for systemjs-builder 0.16.3
// Project: https://github.com/systemjs/builder
// Definitions by: Tobias Melén <https://github.com/tobiasmelen>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="systemjs" />

declare namespace SystemJSBuilder {
    type ModuleTree = { [key: string]: TreeNode };

    type TreeNode = {
        /**
         * Module name
         */
        name: string;
        
        /**
         * Module path
         */
        path: string;

        /**
         * Metadata from System js configuration
         */
        metadata: TreeMetaData;

        /**
         * Array of this module dependencies
         */
        deps: string[];
        
        /**
         * Object listing module dependencies coupled with dependency paths
         * @example <caption>{'jquery': '/vendor/jquery.js'}</caption>
         */
        depMap: SystemJSLoader.ConfigMap;

        /**
         * String containing source of module after being loaded
         */
        source: string;

        /**
         * Indicates if this module load circumvented the builders cache
         */
        fresh: boolean;

        /**
         * Timestamp of this module load
         */
        timestamp: Date;

        /**
         * Hash representation of current SystemJS configuration used
         */
        configHash: string;

        /**
         * Path to plugin used loading this module
         */
        plugin?: string;

        /**
         * Is the plugin used meant for runtime use
         */
        runtimePlugin: boolean;

        /**
         * Package configuration of this module
         */        
        packageConfig?: SystemJSLoader.PackageConfig;

        /**
         * Is this module a SystemJs package configuration
         */
        isPackageConfig: boolean;

        /**
         * Deferred imports found in module, always empty if result is not from Builder.getDeferredImports()
         */
        deferredImports?: {name: string, parent: string}[];

        /**
         * In the case of Rollup, a single load can represent several compacted loads
         * these will be listed here
         */
        compactedLoads?: any[]; 
    };

    interface TreeMetaData extends SystemJSLoader.MetaConfig {
        /**
         * The specific loader module object
         */
        loaderModule?: any;
        
        /**
         * Is this module anonymously named in source
         */
        anonNamed?: boolean;

        /* The following included props will always be undefined, listed here for future reference.
        timestamp: undefined;
        entry: undefined;
        builderExecute: undefined;
        parseTree: undefined;
        ast: undefined;
        */
    }

    type UglifyjsOptions = {
        
    }
    
    interface BundleOptions {
        /**
         * Minify source in bundle output (Default:true)
         */
        minify?: boolean;
        
        /**
         * Options to pass to uglifyjs
         */
        uglify?: UglifyjsOptions;

        /**
         * Allow the minifier to shorten non-public variable names (Default:false)
         */
        mangle?: boolean;
        
        /**
         * Generate source maps for minified code (Default:false)
         */
        sourceMaps?: boolean;

        /**    
         * Include original source in the generated sourceMaps. 
         * This will generate a self-contained sourceMap which will not require the browser to load the original source file during debugging (Default:false)
         */
        sourceMapContents?: boolean;

        /**
         * When true, use line-number level source maps, when false, use character level source maps (Default:false)
         */
        lowResSourceMaps?: boolean 

        /**
         * When building a self-executing bundle, assign the bundle output to a global variable (Default:null)
         */
        globalName?: string | null

        /**
         * When building a self-executing bundle, indicates external dependendencies available in the global context (Default:{})
         */
        globalDeps?: {[key: string]: string}

        /*
         * Override the fetch function to retrieve module source manually (Default:undefined)
         */
        fetch?: ((load: {},  fetch: (load: {}) => string) => string) | undefined;
        
        /**
         * Rewrite required module names to their normalized names (Default:false)
         */
        normalize?: boolean;

        /**
         * Compile modules as anonymous modules (Default:false)
         */
        anonymous?: boolean;

        /**
         * The global used to register compiled modules with systemjs (Default:'System')
         */
        systemGlobal?: string;

        /**
         *  Module format to compile modules to (Default:'umd')
         */
        format?: string;
    }

    type BundleContent = {
        /**
         * Generated bundle source
         */
        source: string;
        
        /**
         * Generated bundle source maps
         */
        sourceMap: string;

        /**
         * Array of module names defined in the bundle
         */
        modules: string[];
    }

    /*
    * Provides a single-file build for SystemJS of mixed-dependency module trees.
    * Builds ES6 into ES5, CommonJS, AMD and globals into a single file in a way that supports the CSP SystemJS loader as well as circular references.
    */

    class Builder {
        /**
         * 
         */
        constructor(baseURL?: string, configFile?: string | SystemJSLoader.Config);

        constructor(configFile: SystemJSLoader.Config);

        constructor();
        /**
         * Loads SystemJS config into the builder instance
         * @param {Object} config: An object conforming to the SystemJS [config api]{@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md} 
         */
        config(config: SystemJSLoader.Config): void;

        /**
         * Loads SystemJS config file into the builder instance
         * @example <caption> builder.loadConfig('config.js').then(() => {}); </caption>
         * @param {string} configFilePath A file conforming to the SystemJS [config api]{@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md}
         * @returns {Promise} Promise which resolves when config has been loaded
         */
        loadConfig(configFilePath: string): Promise<void>;

        /**
         * Synchronous version of {@link Builder#loadConfig} 
         * @param {string} configFilePath A file conforming to the SystemJS [config api]{@link https://github.com/systemjs/systemjs/blob/master/docs/config-api.md}
         */
        loadConfigSync(configFilePath: string): void;

        /**
         * Reset the builder config to its initial state and clear loader registry.
         * This will remove any registered modules, but will maintain the builder's compiled module cache.
         * For efficiency, use {@link Builder#invalidate} to clear individual modules from the cache.
         */
        invalidate(): void;

        /*~ The following methods have seperate declarations since the first parameter has different names in official docs */

        /**
         * Concatenate all modules in the tree or expression and optionally write them out to a file
         * @param bundleSource An aritmhic string expression, module tree or module name array
         * @param outfile The filepath to write out the bundle to
         * @param options Additional bundle options
         * @returns Returns a promise which resolves with the bundle content
         */
        bundle(bundleSource: ModuleTree | string[] | string, outfile?: string, options?: BundleOptions) : Promise<BundleContent>;

        /**
         * Concatenate all modules in the tree or expression and optionally write them out to a file
         * @param bundleSource An aritmhic string expression, module tree or module name array
         * @param options Additional bundle options
         * @returns Returns a promise which resolves with the bundle content
         */
        bundle(bundleSource: ModuleTree | string[] | string, options?: BundleOptions) : Promise<BundleContent>;


        /**
         * Concatenate all modules in the tree to a self-executing (SFX) bundle and optionally write them out to a file
         * Similar to {@link Builder#bundle} but builds a self-executing bundle
         * @param bundleSource An aritmhic string expression, module tree or module name array
         * @param outfile {String} The filepath to write out the bundle to
         * @param options {Object} Additional bundle options
         * @returns {Promise} Returns a promise which resolves with the SFX bundle content
         */
        buildStatic(tree: ModuleTree | string, outfile? : string, options?: BundleOptions) : Promise<BundleContent>;

        /**
         * Concatenate all modules in the module tree expression to a self-executing (SFX) bundle and optionally write them out to a file
         * Similar to {@link Builder#bundle} but builds a self-executing bundle
         * @param expression {String} [A module tree expression]{@link https://github.com/systemjs/builder/blob/master/docs/api.md#module-tree-expressions}
         * @param outfile {String} The filepath to write out the bundle to
         * @param options {Object} Additional bundle options
         * @returns {Promise} Returns a promise which resolves with the SFX bundle content
         */
        //buildStatic(moduleExpression: string, outfile? : string, options?: BundleOptions) : Promise<BundleContent>;

        /**
         * @param expression {String} [A module tree expression]{@link https://github.com/systemjs/builder/blob/master/docs/api.md#module-tree-expressions}
         * @return {Promise} Promise which resolves with the module tree 
         */
        trace(expression: string) : Promise<ModuleTree>;

        /**
         * Concatenates the distinct modules from two module trees
         * @param firstTree {Object} The first tree
         * @param secondTree {Object} The second tree
         * @returns Tree with distinct modules from the two trees combined
         */
        addTrees(firstTree: ModuleTree | string, secondTree: ModuleTree | string) : ModuleTree;

        /**
         * Subtracts all modules from one tree which exists in a second tree
         * @param firstTree {Object} Source tree to subtract from
         * @param secondTree {Object} Tree containing modules to subtract
         * @returns {Object} Tree with the difference of (firstTree - secondTree)
         */
        subtractTrees(firstTree: ModuleTree | string, secondTree: ModuleTree | string) : ModuleTree;

        /**
        * Finds all intersecting modules in two modules trees
        * @param firstTree {Object} The first tree
        * @param secondTree {Object} The second tree
        * @returns {Object} Tree with modules existing in both input trees
        */
        intersectTrees(firstTree: ModuleTree | string, secondTree: ModuleTree | string) : ModuleTree;

    }
}

declare module 'systemjs-builder' {
    export = SystemJSBuilder.Builder;
}