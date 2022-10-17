const express = require('express')
const router = express.Router();
const service = require('./../models/productos')

// Listar todos los productos de la tabla
// getAll
const list = (req, res) =>
    service.list()
        .then((response) => res.json(response))
        .catch((e) => res.json(e))

//getById /GET
const single = (req, res) =>
    service
        .list({ id: req.params.id })
        .then((response) => res.json(response))
        .catch((e) => res.json(e))

// addProducto /POST
const create = (req, res) => {
    const producto = ({ title, price, thumbnail } = req.body);
    return service
        .create(producto)
        .then((res) => res.json(res))
        .catch((e) => res.json(e))

}

const update = (req, res) => {
    const producto = ({ title, price, thumbnail } = req.body);
    return service
        .create(req.params.id, producto)
        .then((res) => res.json(res))
        .catch((e) => res.json(e))

}


router.get("/all", list);
router.get("/:id", single);
router.post("/", create);
router.put("/:id", update);

module.exports = router;