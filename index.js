const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
const exphbs = require('express-handlebars')
const session = require('express-session')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const cartRoutes = require('./routes/cart')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views') // явно указываем папку с шаблонами views

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5ee21ee58114c412d0e6c7d0')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
        
    }
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'my secret value',
    resave: false,
    saveUninitialized: false
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = process.env.MONGODB_URL
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'illiavernigora@gmail.com',
                name: 'Illia',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        }) 
    } catch (e) {
        console.log(e)
    }
}

start()

