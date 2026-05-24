import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Pagination from './Pagination.jsx';
import Menu from './Menu.jsx';
import Header from './Header';
import Footr from './Foot.jsx';
import ShoppingCart from './ShoppingCart.jsx';
import LoginCard from './LoginCard.jsx';

function App() {

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    console.log("saving...", cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => { 
      const existing = prevItems.find(i => i.id === item.id);
      if (existing) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const finalQuantity = Math.max(0, newQuantity); 
    setCartItems(currentItems => {
      const updatedItems = currentItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: finalQuantity };
        }
        return item;
      });
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* صفحه اصلی - هدر نمایش داده می‌شود */}
        <Route 
          path="/" 
          element={
            <>
              <Header cartCount={cartItems.length} /> {/* هدر اینجا قرار گرفته */}
              <Menu addToCart={addToCart} />
              <Footr />
            </>
          } 
        />

        {/* صفحه سبد خرید - هدر نمایش داده می‌شود */}
        <Route 
          path="/shopping" 
          element={
            <>
              <Header cartCount={cartItems.length} /> {/* هدر اینجا قرار گرفته */}
              <ShoppingCart 
                cartItems={cartItems} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem} 
              />
            </>
          } 
        />

        {/* صفحه ورود/ثبت‌نام - هدر نمایش داده نمی‌شود */}
        <Route 
          path="/LoginCard" 
          element={
            <LoginCard />
            // توجه: Header اینجا فراخوانی نشده است
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
