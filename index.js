const redbird = require("redbird");
const { readFileSync, writeFileSync, existsSync } = require("fs");

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

	for (const { src, target } of config.urls) {
		proxy.register(src, target);
	}
}
