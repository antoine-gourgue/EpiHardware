class Product {
    public id: number
    public name: string
    public description: string
    public price: number
    public photo: string

    constructor(id: number, name: string, description: string, price: number, photo: string) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.photo = photo
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            photo: this.photo
        }
    }

    public static fromJSON(json: any) {
        return new Product(json.id, json.name, json.description, json.price, json.photo)
    }
}

export default Product