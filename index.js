const { readFileSync, writeFileSync, existsSync } = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const redbird = require("redbird");
const cors = require("cors");
const httpProxy = require("http-proxy");
const proxy = redbird({ port: config.proxyPort });
const app = express();
let config = JSON.parse(readFileSync("./config.json", "utf-8"));
let proxies = [];

app.use(
	cors({
		origin: "*",
	}),
).use(bodyParser.json({ strict: false }));

for (const url of config.urls) {
	if (url.target.includes("localhost")) {
		proxy.register(url.src, url.target);
	} else {
		proxies.push({ config: url, proxy: httpProxy.createProxyServer({ target: url.target }) });
	}
}

app.post("/api/v1/editProxy", (req, res) => {
	if (req.body.oldSrc && req.body.oldTarget) {
		try {
			httpProxy.proxy.unregister(req.body.oldSrc, req.body.oldTarget);

			proxy.register(req.body.newSrc, req.body.newTarget);
			let actualConfig = JSON.parse(readFileSync("./config.json", "utf-8"));

			actualConfig = actualConfig.filter((config) => config.src !== req.body.oldSrc && config.target !== req.body.oldTarget);

			actualConfig.push({
				src: req.body.newSrc,
				target: req.body.newTarget,
			});

			res.json({ success: true });
		} catch (error) {
			console.log(error);
			res.json({ success: true, error });
		}
	} else {
		res.json({ success: false });
	}
});

app.listen(9999);
