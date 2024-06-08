import ProductMethods from "./methods/ProductMethods";
import OrderMethods from "./methods/OrderMethods";
import UserMethods from "./methods/UserMethods";

// The class is defined as abstract to prevent instantiation
abstract class Repository {
    public static Product: ProductMethods = ProductMethods
    public static Order: OrderMethods = OrderMethods
    public static User: UserMethods = UserMethods
}

export default Repository