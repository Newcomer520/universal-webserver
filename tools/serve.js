/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path'
import cp from 'child_process'
import watch from './lib/watch'

/**
 * Launches Node.js/Express web server in a separate (forked) process.
 */
function serve() {
  return new Promise((resolve, reject) => {
    function start() {
      // if env === development, it will cause babel using react-transform in server code.
      // so we need to prevent from this
      const NODE_ENV = process.env.NODE_ENV === 'development'? 'development/server': process.env.NODE_ENV
      const server = cp.spawn(
        'node',
        // [path.join(__dirname, '../build/server.js')],
        [path.join(__dirname, './server-preloader.js')],
        {
          env: Object.assign({}, process.env, { NODE_ENV: NODE_ENV }),
          silent: false
        }
      )
      server.stdout.on('data', data => {
        let time = new Date().toTimeString()
        time = time.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1')
        process.stdout.write(`[${time}] `)
        process.stdout.write(data)
        if (data.toString('utf8').includes('Server listening at http://')) {
          resolve()
        }
      })
      server.stderr.on('data', data => process.stderr.write(data))
      server.on('error', err => reject(err))
      process.on('exit', () => server.kill('SIGTERM'))
      return server
    }

    let server = start()

    if (global.WATCH) {
      // watch('build/server.js').then(watcher => {
      watch('src/**/*.js').then(watcher => {
        watcher.on('changed', () => {
          server.kill('SIGTERM');
          server = start();
        })
      })
    }
  })
}

export default serve
