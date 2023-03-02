const { query } = require('express');
const db = require('../../helper/connection')
const { v4: uuidv4 } = require('uuid');

const usersModel = {
    // CREATE
    // create: ({ email, password, mobile_number, name, gender, birthdate, address }) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(
    //             `INSERT INTO users (id, email, password, mobile_number, name, gender, birthdate, address) VALUES ('${uuidv4()}','${email}','${password}','${mobile_number}','${name}','${gender}','${birthdate}','${address}')`,
    //             (err, result) => {
    //                 if (err) {
    //                     return reject(err.message)
    //                 } else {
    //                     return resolve({ email, password, mobile_number, name, gender, birthdate, address })
    //                 }
    //             }
    //         )
    //     })
    // },

    // READ
    query: (search, name, sortBy, limit, offset) => {
        let orderQuery = `ORDER BY name ${sortBy} LIMIT ${limit} OFFSET ${offset}`

        if (!search && !name) {
            return orderQuery
        } else if (search && name) {
            return `WHERE name ILIKE '%${search}%' AND name ILIKE '${name}%' ${orderQuery}`
        } else if (search || name) {
            return `WHERE name ILIKE '%${search}%' OR name ILIKE '${name}%' ${orderQuery}`
        } else {
            return orderQuery
        }
    },

    read: function (search, name, sortBy = 'ASC', limit = 25, offset = 0) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * from users ${this.query(search, name, sortBy, limit, offset)}`,
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
                `SELECT 
                p.id, p.email, p.mobile_number, p.profile_image, p.role,
                json_agg(row_to_json(pi)) history 
                FROM users p
                INNER JOIN products_order pi ON p.id = pi.id_user
                AND p.id='${id}'
                GROUP BY p.id`,
                // `SELECT * from users WHERE id='${id}'`,
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
    // update: ({ id, email, password, mobile_number, name, gender, birthdate, address, role, profile_image }) => {
    //     return new Promise((resolve, reject) => {
    //         db.query(`SELECT * FROM users WHERE id='${id}'`, (err, result) => {
    //             // console.log(result);
    //             if (err) {
    //                 return reject(err.message);
    //             } else {
    //                 db.query(
    //                     `UPDATE users 
    //                         SET name='${name || result.rows[0].name}', 
    //                         email='${email || result.rows[0].email}', 
    //                         password='${password || result.rows[0].password}', 
    //                         mobile_number='${mobile_number || result.rows[0].mobile_number}', 
    //                         gender='${gender || result.rows[0].gender}', 
    //                         birthdate='${birthdate || result.rows[0].birthdate}', 
    //                         address='${address || result.rows[0].address}', 
    //                         role='${role || result.rows[0].role}' WHERE id='${id}'`,
    //                     (err, result) => {
    //                         if (err) {
    //                             return reject(err.message)
    //                         } else {
    //                             return resolve({ id, email, password, mobile_number, name, gender, birthdate, address, role, profile_image })
    //                         }
    //                     }
    //                 )
    //             }
    //         })
    //     })
    // },
    update: function (req, id) {
        return new Promise((success, failed) => {
            const { name, email, mobile_number, gender, birthdate, address, role, profile_image } = req.body
            db.query(`SELECT * FROM users WHERE id='${id}'`, (error, result) => {
                if (error) {
                    return failed(error.message)
                } else {
                    // console.log(result);
                    if (result.rows.length < 1) {
                        return failed('Id not found!')
                    } else {
                        db.query(`
                        UPDATE users SET
                        name='${name || result.rows[0].name}',
                        email='${email || result.rows[0].email}',
                        mobile_number='${mobile_number || result.rows[0].mobile_number}',
                        gender='${gender || result.rows[0].gender}',
                        birthdate='${birthdate || result.rows[0].birthdate}',
                        address='${address || result.rows[0].address}',
                        role='${role || result.rows[0].role}', 
                        profile_image='${(req.file != undefined) ? req.file.filename : result.rows[0].profile_image}'
                        WHERE id='${id}'`, (error) => {
                            if (error) {
                                return failed(error.message)
                            } else {
                                return success(result.rows)
                            }
                        })
                    }
                }
            })
        })
    },

    // DELETE
    // untuk remove tergantung paramnya saja, untuk kasus dibawah ini yaitu id.
    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE from users WHERE id='${id}'`,
                (err, result) => {
                    if (err) {
                        return reject(err.message)
                    } else {
                        return resolve(`users ${id} has been deleted`)
                    }
                }
            )
        })
    }
}

module.exports = usersModel