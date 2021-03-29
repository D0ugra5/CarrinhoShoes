import { exception } from "node:console";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {

  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [stockinfo, setStock] = useState<Stock[]>([])
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem("RocketShoes:cart");
    if (storagedCart) {

      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const ProcuraCart = [...cart]
      console.log(ProcuraCart)


      const found = ProcuraCart.find(element => element.id > productId);



      const stock = await api.get(`/stock/${productId}`);
      const amountStock = stock.data.amount
      const NewAmount = found?.amount ? amountStock :1
      
      
    

      const DadosnewPrduto = await api.get(`/products/${productId}`)


      const NewAdd = {
        id: DadosnewPrduto.data.id,
        title: DadosnewPrduto.data.title,
        price: DadosnewPrduto.data.price,
        image: DadosnewPrduto.data.image,
        amount: NewAmount,
      }

      const amount = 1
      const NewAddProducts = [

        NewAdd,
        ...cart,
      ]

      setCart(NewAddProducts)



      // localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))



    } catch {

      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
