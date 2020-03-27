require('dotenv').config()
const core = require('@actions/core')
const { execSync } = require('child_process')
const TelegramBot = require('node-telegram-bot-api')
const github = require('@actions/github')

let heroku = {}
heroku.api_key = process.env.HEROKU_TOKEN
heroku.email = core.getInput('heroku_email')
heroku.app_name = core.getInput('heroku_app_name')
heroku.dontuseforce = core.getInput('dontuseforce') === 'true' ? true : false
heroku.buildpack = core.getInput('buildpack')

const token = process.env.BOT_TOKEN
const chatID = process.env.CHAT_ID

const payload = github.context.payload

const bot = new TelegramBot(token, { polling: true })

const repo = payload.repository.full_name
const repo_link = `https://github.com/${repo}`
const ref = payload.ref
const commit = payload.commits[0].id.slice(0, 7)
const pusher = payload.pusher.name
 
  
  let success_msg = `
  ✅ <b>Deployed all Successfully!</b>
  \n
🧾 <b><a href="${repo_link}">${repo}</a></b> &#13; 
<code>${ref} ${commit} </code> by <b>${pusher}</b>
    
  `;
  
  let fail_msg = `
  ⚠️ <b>Something Went Wrong!</b>
  \n
🧾 <b><a href="${repo_link}">${repo}</a></b> &#13;
<code>${ref} ${commit} </code> by <b>${pusher}</b>

  `;

const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`


const deploy = ({ dontuseforce }) => {
  const force = !dontuseforce ? '--force' : ''
  execSync(`git push heroku master:refs/heads/master ${force}`)
}

const addRemote = ({ app_name, buildpack }) => {
  try {
    execSync('heroku git:remote --app ' + app_name)
    console.log('Added git remote heroku')
  } catch (err) {
    execSync(
      'heroku create ' +
        app_name +
        (buildpack ? ' --buildpack ' + buildpack : '')
    )
    console.log('Successfully created a new heroku app')
  }
}


try {
  console.log(heroku)

  const isShallow = execSync('git rev-parse --is-shallow-repository').toString()

  if (isShallow === 'true\n') {
    execSync('git fetch --prune --unshallow')
  }

  execSync(createCatFile(heroku))
  console.log('Created and wrote to ~./netrc')

  execSync(`cat ~/.netrc`)

  execSync('heroku login')
  console.log('Successfully logged into heroku')
  addRemote(heroku)

  try {
    deploy({ ...heroku, dontuseforce: true })
  } catch (err) {
    console.error(`
              Unable to push branch because the branch is behind the deployed branch. Using --force to deploy branch. 
              (If you want to avoid this, set dontuseforce to 1 in with: of .github/workflows/action.yml. 
              Specifically, the error was: ${err}
          `)

    deploy(heroku)
  }

  core.setOutput(
    'status',
    'Successfully deployed heroku app from branch master'
  )
  bot.sendMessage(chatID, success_msg, { parse_mode: 'html' })
  bot.stopPolling()
} catch (err) {
  core.setFailed(err.toString())
  bot.sendMessage(chatID, fail_msg, { parse_mode: 'html' })
  bot.stopPolling()
}
