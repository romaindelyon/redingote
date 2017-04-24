'use strict';

module.exports = {

	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	app: {
		title: 'Redingote'
	},	
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-material/angular-material.css',
				'public/lib/angular-toastr/dist/angular-toastr.css',
			],
			cssExport: [
				'lib/bootstrap/dist/css/bootstrap.min.css',
				'lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'lib/angular-material/angular-material.min.css',
				'lib/angular-toastr/dist/angular-toastr.css',
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
				'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
				'public/lib/satellizer/satellizer.js',
				'public/lib/ngstorage/ngStorage.min.js',
				'public/lib/ng-idle/angular-idle.js',
				'public/lib/angulartics/dist/angulartics.min.js',
				'public/lib/angulartics-google-analytics/dist/angulartics-ga.min.js',
				'public/lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
				'public/lib/angular-translate/angular-translate.min.js'
			],
			jsExport: [
				'lib/jquery/dist/jquery.min.js',
				'lib/angular/angular.min.js',
				'lib/angular-aria/angular-aria.min.js',
				'lib/angular-animate/angular-animate.min.js',
				'lib/angular-messages/angular-messages.js',
				'lib/angular-resource/angular-resource.min.js',
				'lib/angular-material/angular-material.min.js',
				'lib/angular-ui-router/release/angular-ui-router.min.js',
				'lib/angular-ui-utils/ui-utils.min.js',
				'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'lib/angular-toastr/dist/angular-toastr.tpls.js',
				'lib/satellizer/satellizer.min.js',
				'lib/ngstorage/ngStorage.min.js',
				'lib/ng-idle/angular-idle.min.js',
				'lib/angulartics/dist/angulartics.min.js',
				'lib/angulartics-google-analytics/dist/angulartics-ga.min.js',
				'lib/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
				'lib/angular-translate/angular-translate.min.js'
			]
		},
		css: 'public/dist/application.css',
		cssExport: 'dist/application.min.css',
		js: 'public/dist/application.js',
		jsExport: 'dist/application.min.js'

	}
};
