var cors_proxy = require('myProxy');

// Listen on a specific IP Address
var host = 'localhost';

// Listen on a specific port, adjust if necessary
var port = 3000;

cors_proxy.createServer({
	// Set parameters for:
	// allowed origins,
	// required headers ['origin', 'x-requested-with'],
	// headers to be removed ['cookie', 'cookie2']
}).listen(port, host, function() {
	console.log('Running myProxy on ' + host + ':' + port);
});
