module.exports = function(config) {
	const videoProxies = {};

	for (let i = 1; i <= 16; ++i) {
		videoProxies[`/videos/pano${i}.mp4`] = "/base/test/manual/videos/pano.mp4";
	}
	const karmaConfig = {
		frameworks: ["mocha", "chai", "karma-typescript", "viewport"],
		mime: {
      		'text/x-typescript': ['ts','tsx']
		},
		client: {
			mocha: {
				opts: "./mocha.opts",
			},
		},
		files: [
			"./src/**/*.ts",
			"./test/**/*.ts",
			{pattern: "./test/manual/videos/**/*.*", watched: false, included: false, served: true},
		],
		proxies: videoProxies,
		preprocessors: {
			"src/**/*.ts": ["karma-typescript"],
			"test/**/*.ts": ["karma-typescript"],
		},
		karmaTypescriptConfig: {
			tsconfig: "./tsconfig.test.json",
			reports: {
        		html: {
					"directory": "coverage",
					"subdirectory": "./"
				},
				lcovonly: {
					"directory": "coverage",
					"filename": "lcov.info",
					"subdirectory": "."
				},
			},
			coverageOptions: {
        		instrumentation: true,
				exclude: /test/i,
			}
		},
		browsers: [],
		customLaunchers: {
			CustomChromeHeadless: {
				base: "ChromeHeadless",
				flags: ["--window-size=400,400", "--no-sandbox", "--disable-setuid-sandbox"],
			},
		},
		reporters: ["mocha"],
	};

	karmaConfig.browsers.push(config.chrome ? "Chrome" : "CustomChromeHeadless");

	if (config.coverage) {
		karmaConfig.reporters.push("karma-typescript");
		karmaConfig.singleRun = true;
	}

	config.set(karmaConfig);
};
