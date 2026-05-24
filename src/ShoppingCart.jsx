// ShoppingCart.jsx (نمونه‌ای از ساختار مورد نیاز)
import Foot from "./Foot";
// فرض می‌کنیم ShoppingCart.jsx این props را دریافت می‌کند
function ShoppingCart({ cartItems, onUpdateQuantity, onRemoveItem }) {
  // محاسبه مجموع کل سبد خرید
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
  
    <div className="cart-box">
      <h3>سبد خرید</h3>

      {cartItems.length === 0 ? (
        <p>سبد خرید خالی است.</p>
      ) : (
        <>
          {cartItems.map((product) => (
            <div key={product.id} className="cart-item">
              {/* ... نمایش عکس، عنوان و ... */}
              <img src={product.image_link} alt={product.title} />
              <span>{product.title}</span>

              <div className="cart-controls">
                <button
                  onClick={() => onUpdateQuantity(product.id, product.quantity - 1)} // استفاده از prop
                  disabled={product.quantity <= 1}
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(product.id, product.quantity + 1)} // استفاده از prop
                >
                  +
                </button>
              </div>

              {/* نمایش قیمت هر آیتم */}
              <span>{(product.price * product.quantity).toLocaleString('fa-IR')} تومان</span>

              {/* دکمه حذف */}
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(product.id)} // استفاده از prop
                >
                  حذف
                </button>
              )}
            </div>
          ))}

          {/* نمایش مجموع کل */}
          <div className="cart-total">
            <span>مجموع:</span>
            <span>{totalAmount.toLocaleString('fa-IR')} تومان</span>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;
