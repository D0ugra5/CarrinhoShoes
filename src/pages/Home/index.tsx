import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  //  const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //    // TODO


  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      api("/products ").then((response) => setProducts(response.data));
      console.log(products);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    console.log(id)
  }

  return (
    <ProductList>
      {products.map((products) => (
        <li key={products.id}>
          <img src={products.image} />
          <strong>{products.title}</strong>
          <span>
            {
              new Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL",
              }).format(products.price)
            }
            
          </span>
          <button
            type="button"
            data-testid="add-product-button"
             onClick={() => handleAddProduct(products.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {/* {cartItemsAmount[product.id] || 0} */} 2
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
