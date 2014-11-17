'use strict';

var assert = require('assert');

var Pdf = require('../index.js'),
	child = require('../child.js'),
	FP = process.env.PWD || process.cwd() || __dirname,
	fs = require('fs');

describe('child#supports()', function(){
	it('checks to see if phantomjs is installed', function(d){
		child.supports(function(exists){
			assert.ok(exists);
			d();
		});
	});
});

describe('child#supports()', function(){
	it('checks to see if asdfhijk is installed', function(d){
		child.supports(function(exists){
			assert.ok(!exists);
			d();
		}, 'asdfhijk');
	});
});

// google vs yahoo

describe('pdf#done() 1', function(){
	it('fires done when ', function(d){
		this.timeout(20000);
		var pdf1 = new Pdf('http://www.google.com', 'google.pdf');
		pdf1.on('done', function(msg){
			assert.ok(msg);
			assert.equal(FP + '/google.pdf', msg);
			fs.unlink(FP + '/google.pdf');
			d();
		});
		pdf1.on('error', function(msg){
			assert.ok(false);
			d();
		});
	});
});

describe('pdf#content', function() {
	it('fires done when content is loaded', function(d) {
		var pdf1 = new Pdf(null, 'html.pdf', {
			'content': '<html><body>Test</body></html>'
		});
		pdf1.on('done', function(msg){
			assert.ok(msg);
			assert.equal(FP + '/html.pdf', msg);
			fs.unlink(FP + '/html.pdf');
			d();
		});
		pdf1.on('error', function(msg){
			assert.ok(false);
			d();
		});
	})
});

describe('pdf#done() 2', function(){
	it('fires done when ', function(d){
		this.timeout(20000);
		var pdf2 = new Pdf('http://yahoo.com', 'yahoo.pdf', {
			'viewportSize': {
				'width': 3000,
				'height': 9000
			},
			'paperSize': {
				'pageFormat': 'A4',
				'margin': {
					'top': '2cm'
				},
				'header': {
					'height': '4cm',
					'contents': 'HEADER {currentPage} / {pages}'
				},
				'footer': {
					'height': '4cm',
					'contents': 'FOOTER {currentPage} / {pages}'
				}
			},
			'zoomFactor': 1.1,
			'cookies': [
				{
					'name':     'Valid-Cookie-Name 1',   /* required property */
					'value':    'Valid-Cookie-Value 1',  /* required property */
					'domain':   'localhost',           /* required property */
					'path':     '/foo',
					'httponly': true,
					'secure':   false,
					'expires':  (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
				},
				{
					'name':     'Valid-Cookie-Name 2',
					'value':    'Valid-Cookie-Value 2',
					'domain':   'localhost'
				}
			]
		});
		pdf2.on('done', function(msg){
			assert.ok(msg);
			assert.equal(FP + '/yahoo.pdf', msg);
			fs.unlink(FP + '/yahoo.pdf');
			d();
		});
		pdf2.on('error', function(msg){
			assert.ok(false);
			d();
		});
	});
});

describe('pdf#render()', function(){
	it('renders a pdf with a callback style', function(d){
		this.timeout(5000);
		Pdf.render('http://www.google.com', 'google2.pdf', function(err, file){
			assert.equal(err, false);
			assert.equal(FP + '/google2.pdf', file);
			fs.unlink(FP + '/google2.pdf');
			d();
		});
	});
});


describe('pdf#render()', function(){
	it('renders a pdf with a callback style and content', function(d){
		this.timeout(5000);
		Pdf.render(null, 'google3.pdf', {
				'content': '<html><body>Test</body></html>'
			}, function(err, file){
			assert.equal(err, false);
			assert.equal(FP + '/google3.pdf', file);
			fs.unlink(FP + '/google3.pdf');
			d();
		});
	});
});