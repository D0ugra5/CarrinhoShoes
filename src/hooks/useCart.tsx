import { exception } from "node:console";
import { useEffect } from "react";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { updateEnumDeclaration } from "typescript";
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
      // const ProcuraCart = [...cart];

      // const found = ProcuraCart.find((element) => element.id == productId);

      // const stock = await api.get(`/stock/${productId}`);
      // const amountStock = stock.data.amount;

      // const NewAmount = found?.amount ? found.amount + 1 : 1;

      // if (NewAmount > amountStock) {
      //   toast.error("Quantidade solicitada fora de estoque");
      //   return
      // }

      // const DadosnewPrduto = await api.get(`/products/${productId}`);

      // const NewAdd = {
      //   id: DadosnewPrduto.data.id,
      //   title: DadosnewPrduto.data.title,
      //   price: DadosnewPrduto.data.price,
      //   image: DadosnewPrduto.data.image,
      //   amount: 1,
      // };

      // const NewAddProducts = [NewAdd, ...cart];

      // console.log("NewAdd", NewAddProducts);

      // if (found?.id == productId) {
      //   const NewCart = cart.filter((dados) => dados.id != productId);

      //   NewCart.push({
      //     id: DadosnewPrduto.data.id,
      //     title: DadosnewPrduto.data.title,
      //     price: DadosnewPrduto.data.price,
      //     image: DadosnewPrduto.data.image,
      //     amount: NewAmount,
      //   });

      //   setCart(NewCart);

      //   return;
      // }

      // setCart(NewAddProducts);


      //===================================Solucao  da rockeatSeat
      const stock = await api(`/stock/${productId}`)

      const updateCart = [...cart];

      const productExists = updateCart.find(product => product.id == productId);


      const stockAmount = stock.data.amount;

      const currentAmount = productExists ? productExists.amount : 0
      const amount = currentAmount + 1

      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (productExists) {
        productExists.amount = amount;

      } else {
        const product = await api.get(`/products/${productId}`)

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updateCart.push(newProduct);

      }
      setCart(updateCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart))
    } catch {
      toast.error('Erro na adição do produto');
    }
  };


  const removeProduct = (productId: number) => {
    try {
      //   const RemoveProduct = cart.filter((data) => data.id != productId);

      //   setCart(RemoveProduct);
      // localStorage.setItem("@RocketShoes:cart", JSON.stringify(RemoveProduct));
      const updateCart = [...cart]
      const productIndex = updateCart.findIndex(product => product.id === productId)

      if (productIndex >= 0) {
        updateCart.splice(productIndex, 1)
        setCart(updateCart)
        localStorage.setItem('@RocketShoes:cart',JSON.stringify(updateCart))
      } else {

        toast.error('Erro na remoção do produto');
      }
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // console.log(amount)
      //       if(amount <= 0 ) return
      //       const stock = await api.get(`/stock/${productId}`);
      //       const localItem = cart.map((data) => { 
      //         if(data.id == productId){
      //         if(data.amount < stock.data.amount ||  amount < stock.data.amount ){
      //           data.amount = amount
      //           setCart([data])

      //         }else
      //         {
      //          throw Error();
      //         }
      //        setCart([...cart])
      //         }
      //     });

      if (amount <= 0) {
        return;
      }

      const stock = await api.get(`/stock/${productId}`)
      const stockAmount = stock.data.amount;
      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const updateCart = [...cart];
      const productsExists = updateCart.find(product => product.id === productId)
      if (productsExists) {
        productsExists.amount = amount
        setCart(updateCart)
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(updateCart));
      } else {
        throw Error()
      }


    } catch {
      toast.error("Erro na alteração de quantidade do produto");
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
