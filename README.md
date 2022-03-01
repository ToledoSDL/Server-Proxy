# Server Proxy

## Table of Contents

-   [About](#about)
-   [Usage](#usage)

## About <a name = "about"></a>

The purpose of this repository is to show a simple reverse proxy to perform reverse routing of your applications. Used to route many applications from different domains on a single server, handle SSL with ease among other things.

## Usage <a name = "usage"></a>

Create "config.json" file with the parameters:

```json5
{
	proxyPort: 80, // Which port the proxy will be active, for example, use 80 if you want to access the domain without ports.
	urls: [
		{
			src: "domain.com", // From which domain will the client access.
			target: "http://localhost:3000", // The location where your app is hosted.
		},
		{
			src: "subdomain.domain.com.br",
			target: "http://localhost:3001",
		},
	],
}
```
