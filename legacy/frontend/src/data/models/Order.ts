import Product from "./Product";

class Order {
    public id: string
    public totalPrice: number
    public creationDate: Date
    public products: Product[]

    constructor(id: string, totalPrice: number, creationDate: Date, products: Product[]) {
        this.id = id
        this.totalPrice = totalPrice
        this.creationDate = creationDate
        this.products = products
    }

    public toJSON() {
        return {
            id: this.id,
            totalPrice: this.totalPrice,
            creationDate: this.creationDate,
            products: this.products.map(product => product.toJSON())
        }
    }

    public static fromJSON(json: any) {
        return new Order(json.id, json.totalPrice, json.creationDate, json.products)
    }
}

export default Order
