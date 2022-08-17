const { readFileSync, writeFileSync, existsSync } = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const redbird = require("redbird");

const app = express();

app.use(bodyParser.json({ strict: false }));

if (!existsSync("./config.json")) {
	console.error("File 'config.json' does not exist, creating...");
	writeFileSync(
		"./config.json",
		JSON.stringify(
			{
				proxyPort: 80,
				urls: [
					{
						src: "domain.com",
						target: "http://localhost:3000",
					},
					{
						src: "subdomain.domain.com.br",
						target: "http://localhost:3001",
					},
				],
			},
			null,
			4,
		),
	);
	console.info("File 'config.json' created, edit the information as you like.");
	process.exit(1);
} else {
	let config = JSON.parse(readFileSync("./config.json", "utf-8"));
	const proxy = redbird({ port: config.proxyPort });

	for (const url of config.urls) {
		proxy.register(url.src, url.target);
	}

	app.post("/api/v1/editProxy", (req, res) => {
		if (req.body.oldSrc && req.body.oldTarget) {
			try {
				proxy.unregister(req.body.oldSrc, req.body.oldTarget);

				proxy.register(req.body.newSrc, req.body.newTarget);
				let actualConfig = JSON.parse(readFileSync("./config.json", "utf-8"));

				actualConfig = actualConfig.filter((config) => config.src !== req.body.oldSrc && config.target !== req.body.oldTarget);

				actualConfig.push({
					src: req.body.newSrc,
					target: req.body.newTarget,
				});

				res.json({ success: true });
			} catch (error) {
				res.json({ success: true, error });
			}
		} else {
			res.json({ success: false });
		}
	});
}

app.listen(9999);
