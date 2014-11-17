var page = require('webpage').create();

var contentsCb = function(pobj) {
	if (!pobj || !pobj.contents) return;
	var contentStr = pobj.contents;
	pobj.contents = phantom.callback(function(currentPage, pages) {
		return contentStr.replace(/\{currentPage\}/g, currentPage).replace(/\{pages\}/g, pages);
	});
}

if (phantom.args.length < 2) {
	console.log('incorrect args');
	phantom.exit(1);
} else {
	var options = JSON.parse(phantom.args[2]);

	if (options.content) {
		options.content = options.content.map(function (str) {
			return String.fromCharCode(str);
		}).join('');
	}
	
	contentsCb(options.paperSize.header);
	contentsCb(options.paperSize.footer);

	if (options.cookies) {
		options.cookies.forEach(page.addCookie);
		delete options.cookies;
	}

	for (var key in options) {
		if (options.hasOwnProperty(key) && page.hasOwnProperty(key)) {
			page[key] = options[key];
		}
	}

	if (!options.content) page.open(phantom.args[0]);

	page.onLoadFinished = function(status) {
		if(status !== 'success'){
			console.log('unable to load the address!');
			phantom.exit(1);
		} else {
			window.setTimeout(function(){
				page.render(phantom.args[1], { format: 'pdf' });
				phantom.exit();
			}, options.captureDelay || 400);
		};
	}
};
