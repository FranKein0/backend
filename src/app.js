const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager.js');
const app = express();
const port = 8080;

//parse JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productManager = new ProductManager('./productos.json');

// Endpoint
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        
        if (limit) {
            res.json(products.slice(0, parseInt(limit)));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Endpoint por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
