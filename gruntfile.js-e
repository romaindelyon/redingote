'use strict';

console.log('runnning gruntfile');

var fs = require('fs');

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', '!app/tests/'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/config.js', 'public/application.js',
			'public/modules/accueil/*.js', 'public/modules/accueil/**/*.js',
			'public/modules/cartes/*.js', 'public/modules/cartes/**/*.js',
			'public/modules/confrontations/*.js', 'public/modules/confrontations/**/*.js',
			'public/modules/core/*.js', 'public/modules/core/**/*.js',
			'public/modules/des/*.js', 'public/modules/des/**/*.js',
			'public/modules/jeu/*.js', 'public/modules/jeu/**/*.js',
			'public/modules/joueurs/*.js', 'public/modules/joueurs/**/*.js',
			'public/modules/partie/*.js', 'public/modules/partie/**/*.js',
			'public/modules/plateaux/*.js', 'public/modules/plateaux/**/*.js',],
		clientCSS: ['public/modules/**/*.css', 'public/styles/*.css'],
		jasmine: ['app/tests/**/*.js']
	};


	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},

			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
/*		sass:{
			dist:{
				options: {                       // Target options
					lineNumbers: true,
					sourcemap: 'inline',
				},
				files:{
					'public/modules/core/css/main.css' : 'public/modules/core/css/core.scss'
				}
			}
		},*/
		/*concat: {
			options: {
				// define a string to put between each file in the concatenated output
				//separator: ';'
			},
			dist: {
				// the files to concatenate
				src: ['public/config.js','public/application.js','public/modules/!**!/!*.js', 'public/modules/!**!/!*.js', '!public/modules/!**!/tests/!**'],
				// the location of the resulting JS file
				dest: 'public/dist/application.js'
			}
		},*/
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false,
					sourceMap: true,
					screwIE8: true
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			}
		},
		concat_css: {
			options: {
			// Task-specific options go here. 
			},
			all: {
				src: watchFiles.clientCSS,
				dest: "public/dist/application.css"
			},
		},		
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': watchFiles.clientCSS
				}
			}
		},
		swig: {
			development: {
				init: {
					autoescape: true
				},
				dest: './public/dist',
				src: ['app/views/**/*.swig'],
				generateSitemap: false,
				generateRobotstxt: false,
				cssFiles:'<%= applicationSwigCss %>',
				jsFiles: '<%= applicationSwigJs  %>',
				siteUrl: '',
				production: true,
				robots_directive: 'Disallow /'
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		ngAnnotate: {
			production: {
				files: {
					'public/dist/application.js': watchFiles.clientJS
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			secure: {
				NODE_ENV: 'secure'
			}
		},
		jasmine: {
			src: watchFiles.jasmine,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},		
		copy: {
		    localConfig: {
	            src: 'config/env/local.example.js',
	            dest: 'config/env/local.js',
	            filter: function() {
	            	return !fs.existsSync('config/env/local.js');
	            }
		    },
			dist: {
				src: 'public/dist/views/index.server.view.html',
				dest: 'public/index.html',
				filter: function() {
					return !fs.existsSync('public/index.html');
				}
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-node-inspector');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);

		var swigCss = [];
		var swigJs = [];

		grunt.config.set('applicationJavaScriptFiles', config.assets.js);
		grunt.config.set('applicationCSSFiles', config.assets.css);

		console.log('JS: **************************************************');
		console.log(config.assets.js);
		console.log('******************************************************');

		console.log('CSS: *************************************************');
		console.log(config.assets.css);
		console.log('******************************************************');

		for (var j = 0; j < config.assets.lib.jsExport.length; j++) {
			swigJs.push(config.assets.lib.jsExport[j]);

		}

		swigJs.push(config.assets.jsExport);

		for (var x = 0; x < config.assets.lib.cssExport.length; x++) {
			swigCss.push(config.assets.lib.cssExport[x]);

		}

		swigCss.push(config.assets.cssExport);

		grunt.config.set('applicationSwigJs', swigJs);
		grunt.config.set('applicationSwigCss', swigCss);

	});

	// A  task to version assets and update references
	grunt.registerTask('version-assets', 'version the static assets (now only application.js and application.css)', function() {
	    var Version = require("node-version-assets");
	    var versionInstance = new Version({
	        assets: ['public/dist/application.min.js', 'public/dist/application.min.css', 'public/dist/application.min.js.map'],
	        grepFiles: ['public/index.html'],
	        // keepOriginalAndOldVersions: true,
	        keepOriginal: true,
	        // Note: This string will get replaced via sed command before starting grunt build process
	        newVersion: '20170423213328'	        
	    });

	    var cb = this.async(); // grunt async callback
	    versionInstance.run(cb);
	});

	// Default task(s).
	grunt.registerTask('default', ['concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Secure task(s).
	grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'concat_css', 'uglify', 'cssmin', 'swig', 'copy:dist', 'version-assets']);


	// Test task.
	// grunt.registerTask('test:server', ['env:test', 'jasmine']);
	grunt.registerTask('test:client', ['env:test', 'karma:unit']);
	// grunt.registerTask('test', ['copy:localConfig', 'test:server', 'test:client']); // Enable when server tests are added
	grunt.registerTask('test', ['copy:localConfig', 'test:client']);
};
//'concat',
