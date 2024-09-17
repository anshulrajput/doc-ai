// import all models
const User = require('./models/User.model')

// creating tables and default records
sequelize.sync({ force: false, alter: false }).then(async () => {
    try {
        console.log('DB Success')
    }
    catch (err) {
        console.error(err)
    }
})
