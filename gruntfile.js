module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		less: {
			development: {
				files: {
					"dev/styles/main.css": "src/styles/main.less", // destination file and source file
				},
			},
			production: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2,
				},
				files: {
					"dist/styles/main.min.css": "src/styles/main.less", // destination file and source file
				},
			},
		},
		watch: {
			less: {
				files: ["src/styles/**/*.less"],
				tasks: ["less:development"],
			},
			html: {
				files: ["src/**/*.html"],
				tasks: ["replace:dev"],
			},
			js: {
				files: ["src/scripts/**/*.js"],
				tasks: ["replace:dev"],
			},
		},
		replace: {
			dev: {
				options: {
					patterns: [
						{
							match: "ENDEREÇO_DO_CSS",
							replacement: "./styles/main.css",
						},
						{
							match: "ENDEREÇO_DO_JS",
							replacement: "../src/scripts/main.js",
						},
						{
							match: "ENDEREÇO_DO_JS_PIZZAS",
							replacement: "../src/scripts/pizzas.js",
						},
					],
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ["src/index.html"],
						dest: "dev/",
					},
				],
			},
			dist: {
				options: {
					patterns: [
						{
							match: "ENDEREÇO_DO_CSS",
							replacement: "./styles/main.min.css",
						},
						{
							match: "ENDEREÇO_DO_JS",
							replacement: "./scripts/main.min.js",
						},
						{
							match: "ENDEREÇO_DO_JS_PIZZAS",
							replacement: "./scripts/pizzas.min.js",
						},
					],
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ["temp/index.html"],
						dest: "dist/",
					},
				],
			},
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
				},
				files: {
					"temp/index.html": "src/index.html",
				},
			},
		},
		clean: {
			build: {
				src: ["temp"],
			},
		},
		uglify: {
			options: {
				mangle: false,
			},
			my_target: {
				files: {
					"dist/scripts/main.min.js": ["src/scripts/main.js"],
					"dist/scripts/pizzas.min.js": ["src/scripts/pizzas.js"],
				},
			},
		},
		imagemin: {
			dynamic: {
				files: [
					{
						expand: true,
						cwd: "src/images/",
						src: ["**/*.{png,jpg,gif}"],
						dest: "dist/images/",
					},
				],
			},
		},
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-replace");
	grunt.loadNpmTasks("grunt-contrib-htmlmin");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-imagemin");

	grunt.registerTask("default", ["watch"]);
	grunt.registerTask("build", [
		"less:production",
		"htmlmin:dist",
		"replace:dist",
		"clean:build",
		"uglify:my_target",
	]);
};
