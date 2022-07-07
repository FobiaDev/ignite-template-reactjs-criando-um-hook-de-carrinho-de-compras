import { useState, useEffect } from "react";

import { formatPrice } from "../../util/format";

import { api } from "../../services/api";

import { useCart } from "../../hooks/useCart";

import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";

interface CartItemsAmount {
  [key: number]: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);

  const { cart, addProduct } = useCart();

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  const cartItensAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = { ...sumAmount };
    newSumAmount[product.id] = product.amount;

    return newSumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const data = await api.get<Product[]>("/products").then((response) => {
        return response.data.map((product) => ({
          ...product,
          priceFormatted: formatPrice(product.price),
        }));
      });

      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <ProductList>
      {products.map(({ image, title, price, id }) => {
        return (
          <li key={id}>
            <img src={image} alt={title} />
            <strong>{title}</strong>
            <span>{price}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItensAmount[id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        );
      })}
    </ProductList>
  );
};

export default Home;
