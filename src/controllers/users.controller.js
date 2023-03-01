const usersModel = require("../model/users.model")
const { Pagination, formResponse } = require("../../helper")

const usersController = {
    // create: (req, res) => {
    //     return usersModel.create(req.body)
    //         .then((result) => {
    //             return formResponse(201, "success", result, res)
    //         }).catch((error) => {
    //             return formResponse(500, error)
    //         })
    // },
    read: (req, res) => {
        let { search, name, sortBy, page, limit } = req.query
        let offset = Pagination.buildOffset(page, limit)
        return usersModel.read(search, name, sortBy, limit, offset)
            .then((result) => {
                return res.status(200).send({ message: "Success", data: result })
            }).catch((error) => {
                return res.status(500).send(error)
            })
    },

    readDetail: (req, res) => {
        return usersModel.readDetail(req.params.id)
            .then((result) => {
                if (result != null) {
                    return res.status(200).send({ message: "Success", data: result })
                } else {
                    return res.status(404).send({ message: "Sorry data not found! Please check your input ID!" })
                }
            }).catch((error) => {
                return res.status(500).send(error)
            })
    },
    // update: (req, res) => {
    //     // const request = {
    //     //     ...req.body,
    //     //     id: req.params.id
    //     // }
    //     const request = {
    //         ...req.body,
    //         profile_image: req.file.filename,
    //         id: req.params.id
    //     }
    //     console.log(request);
    //     return usersModel.update(request)
    //         .then((result) => {
    //             // return formResponse(201, "success", result, res)
    //             return res.status(201).send({ message: "Success", data: result })
    //         }).catch((error) => {
    //             return res.status(500).send(error)
    //         })
    // },
    update: (req, res) => {
        // Id product
        const id = req.params.id

        return usersModel.update(req, id)
            .then((result) => {
                // console.log(result[0].img_profile);
                // if (result[0].img_profile != null){
                //     for (let i = 0; i < result.length; i++) {
                //         unlink(`public/uploads/images/${result[i].img_profile}`, (err) => {
                //             if (err) throw err;
                //         });
                //     }
                // }
                return res.status(200).send({ message: `Successfully update data id=${id}` })
            })
            // Error handling
            .catch(error => {
                return res.status(400).send({
                    Status: 400,
                    Message: `${error}`
                })
            })
    },
    remove: (req, res) => {
        return usersModel.remove(req.params.id)
            .then((result) => {
                // console.log(result);
                // console.log(result.rows[0].img_profile);
                for (let i = 0; i < result.length; i++) {
                    // console.log(`public/uploads/images/${result[i].img_profile}`);
                    unlink(`public/uploads/images/${result[i].img_profile}`, (err) => {
                        if (err) throw err;
                    });
                }
                return res.status(200).send({ message: "Success", data: `users ${req.params.id} has been deleted` })
            }).catch((error) => {
                return res.status(500).send(error)
            })
    }
}

module.exports = usersController