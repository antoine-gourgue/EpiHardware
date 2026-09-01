import Order from "../models/Order";
import Product from "../models/Product";

abstract class OrderMethods {
    public static async getAll(): Promise<Order[] | Error> {
        return Error("Not Implemented")
        //Todo Implement this method
    }

    public static async get(id: string): Promise<Order | Error> {
        return Error("Not Implemented")
        //todo Implement this method
    }

    public static async checkout(order: Order): Promise<Order | Error> {
        return Error("Not Implemented")
        //Todo: Implement this method
    }

    public static addToCart(product: Product): void {
        //todo Implement this method
    }

    public static removeFromCart(product: Product): void {
        //todo Implement this method
    }

    public static clearCart(): void {
        //todo Implement this method
    }

    public static getCart(): Product[]|Error {
        return Error("Not Implemented")
        //todo Implement this method
    }
}

export default OrderMethods