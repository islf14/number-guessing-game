import repl from 'node:repl'

function welcome () {
  const welcome = `
  ________________________________________________

  Welcome to the Number Guessing Game!
  I'm thinking of a number between 1 and 100.
  You have 5 chances to guess the correct number.
  
  Please select the difficulty level:
  1. Easy (10 chances)
  2. Medium (5 chances)
  3. Hard (3 chances)
  
  Enter your choice:`
  console.log(welcome)
}
welcome()

let statusGame, chances, attempts, randomNumber

function resetValues () {
  statusGame = 'begin'
  chances = 0
  attempts = 0
  randomNumber = 0
}
resetValues()

function createRandom () {
  randomNumber = Math.round(Math.random() * 100)
}
createRandom()

const replServer = repl.start({
  prompt: '  >> ',
  eval: gameEval,
  writer: myWriter
})

replServer.defineCommand('reboot', {
  help: 'Restart the game',
  action () {
    this.clearBufferedCommand()
    resetValues()
    welcome()
    createRandom()
    this.displayPrompt()
  }
})

async function gameEval (cmd, context, filename, callback) {
  callback(null, await guessingGame(cmd))
}

function myWriter (output) {
  const text = `  ${output} \n`
  return text
}

function myParseInt (value) {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue)) return false
  return parsedValue
}

async function guessingGame (input) {
  if (statusGame !== 'finished') {
    const number = myParseInt(input)
    if (number) {
      // choose difficulty
      if (statusGame === 'begin') {
        if (number > 0 && number < 4) {
          statusGame = 'choose'
          let mDiff = ''
          if (number === 1) {
            chances = 10
            mDiff = 'Easy'
          }
          if (number === 2) {
            chances = 5
            mDiff = 'Medium'
          }
          if (number === 3) {
            chances = 3
            mDiff = 'Hard'
          }
          const messageStart = `\n  Great! You have selected the ${mDiff} difficulty level. \n  Let's start the game! \n\n  Enter your guess:`
          return messageStart
        } else return 'error: please select the difficulty level.'
      }

      // playing
      if (statusGame === 'choose') {
        if (number > 0 && number < 101) {
          if (chances > 0) {
            chances -= 1
            attempts += 1
            if (number === randomNumber) {
              statusGame = 'finished'
              return `Congratulations! You guessed the correct number in ${attempts} attempts.`
            } else {
              if (chances > 0) {
                let hint = ''
                if (number > randomNumber) hint = 'less'
                else hint = 'greater'
                const messageChoose = `Incorrect! The number is ${hint} than ${number}. \n  Remaining chances: ${chances}. \n\n  Enter your guess:`
                return messageChoose
              } else {
                statusGame = 'finished'
                return `Sorry, you're out of attempts.\n  The number I was thinking of was ${randomNumber}`
              }
            }
          } else return ''
        } else return 'error: please must be a number from 1 to 100'
      }
    } else return 'error: must be a positive number'
  } return 'Please, run .reboot to restart the game or .exit to finish.'
}
