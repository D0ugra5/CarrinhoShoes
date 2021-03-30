import { exception } from "node:console";
import { useEffect } from "react";
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
  const [stockinfo, setStock] = useState<Stock[]>([]);

  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const ProcuraCart = [...cart];

      const found = ProcuraCart.find((element) => element.id == productId);

      const stock = await api.get(`/stock/${productId}`);
      const amountStock = stock.data.amount;

      const NewAmount = found?.amount ? found.amount + 1 : 1;

      if (NewAmount > amountStock) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      const DadosnewPrduto = await api.get(`/products/${productId}`);

      const NewAdd = {
        id: DadosnewPrduto.data.id,
        title: DadosnewPrduto.data.title,
        price: DadosnewPrduto.data.price,
        image: DadosnewPrduto.data.image,
        amount: 1,
      };

      const NewAddProducts = [NewAdd, ...cart];

      console.log("NewAdd", NewAddProducts);

      if (found?.id == productId) {
        const NewCart = cart.filter((dados) => dados.id != productId);

        NewCart.push({
          id: DadosnewPrduto.data.id,
          title: DadosnewPrduto.data.title,
          price: DadosnewPrduto.data.price,
          image: DadosnewPrduto.data.image,
          amount: NewAmount,
        });

        setCart(NewCart);

        return;
      }

      setCart(NewAddProducts);
    } catch(err) {
     console.log(err)
    }
  };
  useEffect(() => {
    console.log(cart);
    localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
  }, [cart]);


  const removeProduct = (productId: number) => {
    try {
    const RemoveProduct = cart.filter(data => data.id != productId)

    setCart(RemoveProduct)
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
