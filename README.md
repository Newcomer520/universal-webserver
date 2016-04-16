# Wiprognosis V2
[![build statussss](https://gitlab.mrd3.openlab.tw/jenkins/project/wiprognosis-web-portal/status.png?ref=develop)](https://gitlab.mrd3.openlab.tw/jenkins/project/wiprognosis-web-portal?ref=develop)
## Installation
```
$ npm install
```

## Running development server
```
$ npm run dev
```
and then visit http://localhost:3000

## Universal rendering
### Main libraries to help us do universal rendering
* **react**
As the usual way, react is responsible for rendering the wanted component to string.
* **redux**
Application state are managed at both server and client. Furthurmore, server will pass the initial state of redux store to the browser via `window.__reduxState__`
* **react-router**
Routes are defined in `react-router` way. It helps us to get the correct component to be rendered.
* **redux-saga**
We use `redux-saga` to compose many asychronous tasks. The major purpose is for related fetching and authentication flow. Since the authetication flow is the token based architecture. With `redux-saga` composable tasks are elegant and maintable.

### Universal Fetching data
In my opinion, this is the most difficult when doing universal rendering. More precisely, the difficulty is to fetch secured data. References to the [server rendering guide](https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md) of `react-router`:
> For data loading, you can use the renderProps argument to build whatever convention you want--like adding static load methods to your route components, or putting data loading functions on the routes--it's up to you.

and the solution by [asyc-props](https://github.com/ryanflorence/async-props), components which should should be fed data are assigned static property `preloader` with related `redux actions`(without dispatch bound, just pure action creators), server and browser will try to fetch data in slightly different ways but use the same action creators. This way allows these action creators reusable in some user interactions managed by components, and the truly ***universal***.
## Server
Refactored with [koa](https://github.com/koajs/koa)
### Authentication architecture
Will powered by json web token.

## Livereload
Currently it could be shown by modifying ./src/App/App.less.
Changing the color should invoke the page being refreshed automatically

## React Hot Transform
Click buttons to add or subtract some numbers, and then modify the rendering content of component App.
It should persist the current state but react the latest rendering result

## Api Document
### Generate documents
```
$ gulp apidoc
```
### Monitor files changed when development:
```
$ gulp watch-apidoc
```
Visit `/apidoc/`

## Docker
### Build docker image
1.
```
$ npm install
```
2.
```
$ npm run build
```
3.
```
$ docker build -t <tag-name> .
```
### Container startup script
Refer to `./docker/scripts/start.sh`

