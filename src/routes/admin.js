const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')
const Entry = require('../models/Entry')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

AdminJS.registerAdapter(AdminJSMongoose)

const adminJs = new AdminJS({
  databases: [],
  rootPath: '/admin',
  resources: [Entry,{
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if(request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      }
    }
  }],
  branding: { companyName: 'M17 Guestbook', },
})

const router = AdminJSExpress.buildRouter(adminJs)

/*
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'change-this-to-a-really-long-string',
})
*/

module.exports = router;