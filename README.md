## SSuricat Extension
* includes awesome messaging module
* webpack-based build system
* full ES6 support with Babel 6
* linting using eslint with airbnb configuration
* use node.js libraries
* unit-tests in mocha

### Build instructions:

To install dependencies:

    cd chrome-extension-skeleton
    npm install

Then to start a developing session (with watch), run:

    npm start

To start a unit testing session (with watch):

    npm test

To check code for linting errors:

    npm run lint


To build production code + crx:

    npm run build

To run unit tests in CI scripts:

    npm run test:ci


### Directory structure:

    /build             # this is where your extension (.crx) will end up,
                       # along with unpacked directories of production and
                       # develop build (for debugging)

    /src
        /css           # CSS files
        /html          # HTML files
        /images        # image resources

        /js            # entry-points for browserify, requiring node.js `modules`

            /libs      # 3rd party run-time libraries, excluded from JS-linting
            /modules   # node.js modules (and corresponding mocha
                       #   unit tests spec files)

        manifest.json  # skeleton manifest file, `name`, `description`
                       #   and `version` fields copied from `package.json`

    /webpack           # webpack configuration files

    .babelrc           # Babel configuration
    .eslintrc          # options for JS-linting
    mykey.pem          # certificate file, YOU NEED TO GENERATE THIS FILE, see below
    package.json       # project description file (name, version, dependencies, ...)
