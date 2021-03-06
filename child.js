var child = require('child_process');

var which = process.platform == 'win32' ? 'where' : 'which';

var path = require('path');

var phantomjs = require('phantomjs');

exports.exec = function(url, filename, options, cb){
	var key,
		stdin = [];

	stdin.push(options.args || "");
	stdin.push(path.join(__dirname, 'render.js'));
	stdin.push(url || "about:blank");
	stdin.push(filename || "");
	stdin.push(JSON.stringify(options));

	return child.execFile(phantomjs.path, stdin, function(err, stdo, stde){
		cb ? cb(err) : null;
	});
};

exports.supports = function(cb, cmd) {
	var stream = child.exec(which+' '+(cmd || 'phantomjs'), function(err, stdo, stde){
		return cb(!!stdo.toString() || !!phantomjs.path);
	});
};
