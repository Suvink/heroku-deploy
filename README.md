# Heroku Deploy with Telegram

A simple Github Action to deploy to Heroku and notify via Telegram.

![Generic badge](https://img.shields.io/badge/Made%20for-Heroku-blueviolet.svg)  ![Generic badge](https://img.shields.io/badge/Notifies-Telegram-blue.svg) ![GitHub stars](https://img.shields.io/github/stars/Suvink/heroku-deploy?style=social)
<br>
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

## Usage
Goto Actions tab on your Github Repository and create a new workflow.
Use the following template to create your action.

```yaml
name: Heroku Deploy with Telegram
	'on': 
		push:
			branches: [master]
jobs:
	build:
		runs-on: ubuntu-latest
		steps:
			- name: Checkout
			  uses: actions/checkout@v2

			- name: Deploy to Heroku
			  uses: Suvink/heroku-static@v0.3
			  with:
				heroku_app_name: Your unique Heroku app name
				heroku_email: Email you used for Heroku
				dontuseforce: false #Disable force push [optional]
				buildpack: Your buildpack 
			  env:
				HEROKU_TOKEN: '${{ secrets.HEROKU_TOKEN }}'
				BOT_TOKEN: '${{ secrets.BOT_TOKEN }}'
				CHAT_ID: '${{ secrets.CHAT_ID }}'

```

## Secrets
- HEROKU_TOKEN :  [Required] Refer [here]([https://devcenter.heroku.com/articles/authentication](https://devcenter.heroku.com/articles/authentication)) to get a Heroku Access Token.
- BOT_TOKEN: [Required] Refer [here]([https://core.telegram.org/bots#3-how-do-i-create-a-bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)) to get a Telegram Bot Token.
- CHAT_ID: [Required] Add `@chatid_echo_bot` to the chat you want and it will echo your chat ID starting with a "-".

## Licence
This project is licensed under the MIT License - see the [LICENSE](https://github.com/SuvinkS/heroku-deploy/blob/master/LICENSE) file for details