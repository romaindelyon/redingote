'use strict';

module.exports = {
	app: {
		title: 'Redingote',
		description: 'Une bien belle redingote',
		keywords: ''
	},
	port: process.env.PORT || 3001,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'Red_Redingote',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-material/angular-material.css',
				'public/lib/angular-toastr/dist/angular-toastr.css',
				'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-aria/angular-aria.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-messages/angular-messages.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-material/angular-material.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				// 'public/lib/angular-toastr/dist/angular-toastr.js',
				'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
				'public/lib/satellizer/satellizer.js',
				'public/lib/ngstorage/ngStorage.min.js',
				'public/lib/ng-idle/angular-idle.js',
				'public/lib/angulartics/dist/angulartics.min.js',
				'public/lib/angulartics-google-analytics/dist/angulartics-ga.min.js',
				'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
				'public/lib/angular-translate/angular-translate.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/styles/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'node_modules/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
