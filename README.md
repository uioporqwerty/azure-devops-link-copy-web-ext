# Azure DevOps Fast Copy

<div align="center"><img src="./app/images/icon-128.png" alt="logo"></div>
<br/>

![Mozilla Add-on](https://img.shields.io/amo/v/%7B7069c89a-e845-4505-9f90-9dfffe9ef0d7%7D)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/lgedpfdllfdjkfjfilhnklfeclpppell)
[Opera](https://addons.opera.com/en/extensions/details/azure-devops-fast-copy/)

This is a browser extension that aims to quickly copy a link to an Azure DevOps work item with the click of a button. The inspiration is similar to JIRA's behavior of hovering over a ticket which displays an icon you can click and then that will copy the link to the JIRA ticket to your clipboard. The extension is compatible with light and dark background Azure DevOps themes.

If you enjoyed the extension:

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

[buymeacoffee]: https://www.buymeacoffee.com/nybblr
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png

## Developing

Source code lives in `/app`. `webextensions-toolbox` is used to develop for multiple browsers. `content_script.js` is the main entry point for this simple extension and styling is provided by `app.css`.

## Running

1. Clone the repo
2. `npm install`
3. Choose which browser vendor you would like to develop under then run: `npm start:[VENDOR]` (e.g. `npm start:firefox`)
4. Follow the instructions on how to load the unpacked extension under `dist/[VENDOR]` so that you can develop.
