const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        if (fs.existsSync(this.path)) {
            try {
                const data = fs.readFileSync(this.path, 'utf8');
                this.products = JSON.parse(data);
                if (!Array.isArray(this.products)) {
                    this.products = [];
                }
            } catch (error) {
                console.error('Error al leer el archivo:', error.message);
            }
        } else {
            //si el archivo no existe, crea un array vacío y el archivo JSON.
            this.saveProductsToFile();
        }
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al escribir en el archivo:', error.message);
        }
    }

    addProduct(product) {
        //codigo de verificacion por si el producto ya existe por su código
        const isCodeRepeated = this.products.some(existingProduct => existingProduct.code === product.code);

        if (isCodeRepeated) {
            console.error("Ya existe un producto con ese código.");
            return;
        }

        //id autoincrementable
        product.id = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;

        this.products.push(product);
        this.saveProductsToFile();
        console.log(`Producto agregado: ${product.title}`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.error("Producto no encontrado.");
        }

        return product;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            // Actualizar el producto
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProductsToFile();
            console.log(`Producto actualizado con éxito: ${this.products[index].title}`);
        } else {
            console.error("Producto no encontrado para actualizar.");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);

        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProductsToFile();
            console.log(`Producto eliminado con éxito: ${deletedProduct.title}`);
        } else {
            console.error("Producto no encontrado para eliminar.");
        }
    }
}