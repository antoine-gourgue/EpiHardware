import Product from "../models/Product";

abstract class ProductMethods {
    public static async getAll(): Promise<Product[] | Error> {
        return await fetch('http://localhost:3000/products') // Todo: update the URL of this fetch request
            .then(response => {
                let data: any = response.json()
                if (!response.ok) {
                    throw new Error(data.message)
                }
                return data
            })
            .then(data => {
                return data.map((productData: any) => {
                    return new Product(
                        productData.id, productData.name, productData.description, productData.price, productData.photo)
                })
            })
            .catch((error) => {
                return error
            })
    }

    public static async get(id: number): Promise<Product | Error> {
        return await fetch(`http://localhost:3000/products/${id}`) // Todo: update the URL of this fetch request
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json();
            })
            .then(data => {
                return new Product(data.id, data.name, data.description, data.price, data.photo)
            })
            .catch((error) => {
                return error
            });
    }

    public static async create(product: Product): Promise<Product | Error> {
        return await fetch('http://localhost:3000/products', { // Todo: update the URL of this fetch request
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product.toJSON())
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json();
            })
            .catch((error) => {
                return error
            });
    }

    public static async update(product: Product): Promise<Product | Error> {
        return Error("Not Implemented")
        //Todo: Implement the update method
    }

    public static async delete(product: Product): Promise<Product | Error> {
        return Error("Not Implemented")
        //Todo: Implement the delete method
    }
}

export default ProductMethods