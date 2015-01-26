# Pin Sports

***

## Frontend

### Installation

* [Node.js](http://nodejs.org/download/). Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.

* Copy "app/gulpfile.local.sample.js" to "app/gulpfile.local.js". In "app/gulpfile.local.js" file change "'/webroot/'" to your own webroot e.g. '/selfcare.ortelmobile.be/'.

* Install local dependencies (the dependencies declared in the package.json file):

    ```
    cd app
    ```

    ```
    npm install
    ```

### Building

* Production:

    ```
    npm run build
    ```


* Development:

    ```
    npm run build-dev
    ```

### Some of the common issues

* If 'npm install' command throws "Error ENOENT, stat ``", you need to manually add empty folder  "c:\Users\{username}\AppData\Roaming\npm"

* If 'npm install' fails due to error 'ENOGIT git is not installed or not in the PATH' check this link http://stackoverflow.com/questions/20666989/bower-enogit-git-is-not-installed-or-not-in-the-path

* If during the 'npm install' process question of which AngularJS version should be used in the project is thrown. Your answer should be [1] AngularJS #1.2.16
