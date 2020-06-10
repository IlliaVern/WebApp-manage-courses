const path = require('path')
const fs = require('fs')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
)

class Cart {
    static async add(course) {
        const cart = await Cart.fetch()

        const index = cart.courses.findIndex(c => c.id === course.id)
        const candidate = cart.courses[index]

        if (candidate) { // if course already exists
            candidate.count++
            cart.courses[index] = candidate
        } else { // else add new course count
            course.count = 1
            cart.courses.push(course)
        }

        cart.price += +course.price

        return new Promise ((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    static async remove(id) {
        const cart = await Cart.fetch() 

        const index = cart.courses.findIndex(c => c.id === id)
        const course = cart.courses[index]

        if (course.count ===1) { //delete
            cart.courses = cart.courses.filter(c => c.id !== id)
        } else { // change quantity
            cart.courses[index].count--
        }

        cart.price -= course.price

        return new Promise ((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(cart)
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}


module.exports = Cart