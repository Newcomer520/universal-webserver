# Universal Webserver on Node.js
---
## Installation
---
```
$ npm install
```
## Running development server
---
```
$ npm run dev
```
and then visit http://localhost:3000
## Livereload
---
Currently it could be shown by modifying ./src/App/App.less.
Changing the color should invoke the page being refreshed automatically
## React Hot Transform
---
Click buttons to add or subtract some numbers, and then modify the rendering content of component App.
It should persist the current state but react the latest rendering result
## Api Document
--
### Generate documents
```
$ gulp apidoc
```
### Monitor files changed when development:
```
$ gulp watch-apidoc
```
Visit `/apidoc/`
