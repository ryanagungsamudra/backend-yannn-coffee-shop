const { query } = require('express');
const db = require('../../helper/connection')
const { v4: uuidv4 } = require('uuid');

const productModel = {
    // CREATE
    create: ({ title, id_user, price, category, size, quantity, delivery, time, product_image }) => {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO products_order (id, title, id_user, price, category, size, quantity, delivery, time, product_image) VALUES ('${uuidv4()}','${title}','${id_user}','${price}','${category}','${size}','${quantity}','${delivery}','${time}','${product_image}')`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        return resolve({ title, id_user, price, category, size, quantity, delivery, time, product_image })
                    }
                }
            )
        })
    },

    // READ
    query: (search, category, sortBy, limit, offset) => {
        let orderQuery = `ORDER BY title ${sortBy} LIMIT ${limit} OFFSET ${offset}`

        if (!search && !category) {
            return orderQuery
        } else if (search && category) {
            return `WHERE title ILIKE '%${search}%' AND category ILIKE '${category}%' ${orderQuery}`
        } else if (search || category) {
            return `WHERE title ILIKE '%${search}%' OR category ILIKE '${category}%' ${orderQuery}`
        } else {
            return orderQuery
        }
    },

    read: function (search, category, sortBy = 'ASC', limit = 25, offset = 0) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * from products_order ${this.query(search, category, sortBy, limit, offset)}`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        return resolve(result.rows)
                    }
                }
            )
        })
    },

    readDetail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * from products_order WHERE id='${id}'`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        return resolve(result.rows[0])
                    }
                }
            );
        })
    },

    // UPDATE
    update: ({ id, title, id_user, price, category }) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM products_order WHERE id='${id}'`, (err, result) => {
                if (err) {
                    return reject(err.message);
                } else {
                    db.query(
                        `UPDATE products_order SET title='${title || result.rows[0].title}', id_user='${id_user || result.rows[0].id_user}',price='${price || result.rows[0].price}', category='${category || result.rows[0].category}' WHERE id='${id}'`,
                        (err, result) => {
                            if (err) {
                                return reject(err.message)
                            } else {
                                return resolve({ id, title, id_user, price, category })
                            }
                        }
                    )
                }
            })
        })
    },

    // DELETE
    // untuk remove tergantung paramnya saja, untuk kasus dibawah ini yaitu id.
    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE from products_order WHERE id='${id}'`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        return resolve(`products_order ${id} has been deleted`)
                    }
                }
            )
        })
    }
}

module.exports = productModel