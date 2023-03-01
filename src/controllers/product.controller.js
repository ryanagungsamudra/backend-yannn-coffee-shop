const productModel = require("../model/product.model")
const { Pagination, formResponse } = require("../../helper")
const { unlink } = require('node:fs')

const productController = {
    create: (req, res) => {
        const request = {
            ...req.body,
            file: req.files, //uncomment if multiple

            // img: req.file.filename, //uncomment if single
            //depend on product.route, formUpload.single or formUpload.array
        }
        return productModel.create(request)
            .then((result) => {
                return formResponse(201, "success", result, res)
            }).catch((error) => {
                return formResponse(500, error)
            })
    },
    read: (req, res) => {
        // console.log(req.query);
        let { search, category, sortBy, page, limit } = req.query
        let offset = Pagination.buildOffset(page, limit)
        return productModel.read(search, category, sortBy, limit, offset)
            .then((result) => {
                return res.status(201).send({ message: "succes", data: result })
                // return formResponse(200, "success", result, res)
            }).catch((error) => {
                return res.status(500).send({ message: error })
                // return formResponse(500, error)
            })
    },
    readDetail: (req, res) => {
        return productModel.readDetail(req.params.id)
            .then((result) => {
                if (result != null) {
                    return formResponse(201, "success", result, res)
                    // return res.status(200).send({ message: "Success", data: result })
                } else {
                    return res.status(404).send({ message: "Sorry data not found! Please check your input ID!" })
                }
            }).catch((error) => {
                return formResponse(500, error)
            })
    },
    update: (req, res) => {
        const request = {
            ...req.body,
            id: req.params.id,
            file: req.files
        }
        console.log(request);
        return productModel.update(request)
            .then((result) => {
                if (typeof result.oldImages != "undefined") {
                    for (let index = 0; index < result.oldImages.length; index++) {
                        console.log(result.oldImages[index].filename)
                        unlink(`public/uploads/images/${result.oldImages[index].filename}`, (err) => {
                            console.log(`successfully deleted ${result.oldImages[index].filename}`)
                        });
                    }
                }
                return res.status(201).send({ message: "succes", data: result })
                // return formResponse(201, "success", result, res)
            }).catch((error) => {
                return res.status(500).send({ message: error })
                // return formResponse(500, error)
            })
    },
    remove: (req, res) => {
        return productModel.remove(req.params.id)
            .then((result) => {
                // Looping untuk setiap index pada data result
                for (let i = 0; i < result.length; i++) {
                    unlink(`public/uploads/images/${result[i].filename}`, (err) => {
                        if (err) throw err;
                        // console.log(`Product has been deleted! ${result[i].filename}`);
                    });
                }
                return res.status(201).send({ message: "succes deleted", data: result })
                // return formResponse(201, "success", result, res)
            }).catch((error) => {
                return res.status(500).send({ message: error })
                // return formResponse(500, error)
            })
    }
}

module.exports = productController