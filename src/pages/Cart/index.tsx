import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
 import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
   const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product=>({
      ...product,
priceFormatted: formatPrice(product.price),
subTotal:formatPrice(product.price * product.amount)
  
  
  }))

   const total =
     formatPrice(
      cart.reduce((sumTotal, product) => {
      let price = product.amount * product.price
 let results = price

      return sumTotal + results
   }, 0)
   )

  function handleProductIncrement(product: Product) {
  const productId  =  product.id
  const amount = product.amount + 1 

    var info  ={
    productId,
    amount
   }
 updateProductAmount(info)
   
   
   
  }

  function handleProductDecrement(product: Product) {
    const productId  =  product.id
  const amount = product.amount - 1 

    var info  ={
    productId,
    amount
   }
 updateProductAmount(info)
  }

  function handleRemoveProduct(productId: number) {
   removeProduct(productId)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
          {cartFormatted.map((product)=>(
            <tbody>
            <tr data-testid="product">
              <td>
                <img src={product.image} />
              </td>
             
              <td>
                <strong>Tênis de Caminhada Leve Confortável</strong>
                <span>{product.priceFormatted }</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                  // disabled={product.amount <= 1}
                   onClick={() => handleProductDecrement(product)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
           
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={product.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                   onClick={() => handleProductIncrement(product)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subTotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
               onClick={() => handleRemoveProduct(product.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          </tbody>
          )

          )}
        
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
