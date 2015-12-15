/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import gaze from 'gaze';

export default (p) => {
	return new Promise((resolve, reject) => gaze(p, (err, watcher) => err ? reject(err) : resolve(watcher)))	
	// return new Promise((resolve, reject) => args.forEach(pattern => gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher))))
}
  // gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher));

