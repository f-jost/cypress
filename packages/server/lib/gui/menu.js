const _ = require('lodash')
const os = require('os')
const { Menu } = require('electron')
const { shell } = require('electron')

const appData = require('../util/app_data')
const open = require('../util/open')

let onLogOutClicked = function () {}

module.exports = {
  set (options = {}) {
    _.defaults(options, {
      withDevTools: false,
    })

    // this set by modes/interactive.coffee and needs to be preserved if the menu
    // is set again by launcher.coffee when the Electron browser is run
    if (options.onLogOutClicked) {
      ({ onLogOutClicked } = options)
    }

    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Changelog',
            click () {
              shell.openExternal('https://on.cypress.io/changelog')
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Manage Account',
            click () {
              shell.openExternal('https://on.cypress.io/dashboard')
            },
          },
          {
            label: 'Log Out',
            click: onLogOutClicked,
          },
          {
            type: 'separator',
          },
          {
            label: 'View App Data',
            click () {
              open.opn(appData.path())
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Close Window',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall',
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Actual Size',
            accelerator: 'CmdOrCtrl+0',
            role: 'resetzoom',
          },
          {
            label: 'Zoom In',
            accelerator: 'CmdOrCtrl+Plus',
            role: 'zoomin',
          },
          {
            label: 'Zoom Out',
            accelerator: 'CmdOrCtrl+-',
            role: 'zoomout',
          },
        ],
      },
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize',
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Support',
            click () {
              shell.openExternal('https://on.cypress.io/support')
            },
          },
          {
            label: 'Documentation',
            click () {
              shell.openExternal('https://on.cypress.io')
            },
          },
          {
            label: 'Download Chromium',
            click () {
              shell.openExternal('https://on.cypress.io/chromium-downloads')
            },
          },
          {
            label: 'Report an Issue',
            click () {
              shell.openExternal('https://on.cypress.io/new-issue')
            },
          },
        ],
      },
    ]

    if (os.platform() === 'darwin') {
      const name = 'Cypress'

      template.unshift({
        label: name,
        submenu: [
          {
            label: `About ${name}`,
            role: 'about',
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            role: 'services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: `Hide ${name}`,
            accelerator: 'Command+H',
            role: 'hide',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            role: 'hideothers',
          },
          {
            label: 'Show All',
            role: 'unhide',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            //role: "quit" ## must upgrade to latest electron
            // eslint-disable-next-line no-unused-vars
            click: (item, focusedWindow) => {
              process.exit(0)
            },
          },
        ],
      })
    }

    if (options.withDevTools) {
      template.push(
        {
          label: 'Developer Tools',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'CmdOrCtrl+R',
              click: (item, focusedWindow) => {
                if (focusedWindow) {
                  focusedWindow.reload()
                }
              },
            },
            {
              label: 'Toggle Developer Tools',
              accelerator: (() => {
                if (os.platform() === 'darwin') {
                  return 'Alt+Command+I'
                }

                return 'Ctrl+Shift+I'
              })(),
              click: (item, focusedWindow) => {
                if (focusedWindow) {
                  focusedWindow.toggleDevTools()
                }
              },
            },
          ],
        }
      )
    }

    const menu = Menu.buildFromTemplate(template)

    return Menu.setApplicationMenu(menu)
  },
}
