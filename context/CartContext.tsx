"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image_url: string | null;
  quantity: number;
};

type ProductToAdd = Omit<CartItem, "quantity">;

type CartContextType = {
  items: CartItem[];

  totalItems: number;
  totalPrice: number;

  addItem: (product: ProductToAdd, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "meraki-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /*
   * Recuperar carrito al cargar la aplicación
   */
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Error cargando el carrito:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /*
   * Guardar automáticamente cuando cambia
   */
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error guardando el carrito:", error);
    }
  }, [items, isLoaded]);

  /*
   * Agregar producto
   */
  const addItem = (
    product: ProductToAdd,
    quantity = 1
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      /*
       * Ya existe:
       * aumentar cantidad sin superar stock.
       */
      if (existingItem) {
        return currentItems.map((item) => {
          if (item.id !== product.id) {
            return item;
          }

          return {
            ...item,
            quantity: Math.min(
              item.quantity + quantity,
              product.stock
            ),
            stock: product.stock,
          };
        });
      }

      /*
       * Producto nuevo
       */
      return [
        ...currentItems,
        {
          ...product,
          quantity: Math.min(
            Math.max(quantity, 1),
            product.stock
          ),
        },
      ];
    });
  };

  /*
   * Eliminar producto
   */
  const removeItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  /*
   * Modificar cantidad
   */
  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            Math.max(quantity, 1),
            item.stock
          ),
        };
      })
    );
  };

  /*
   * Vaciar carrito
   */
  const clearCart = () => {
    setItems([]);
  };

  /*
   * Cantidad total
   */
  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  /*
   * Precio total
   */
  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}