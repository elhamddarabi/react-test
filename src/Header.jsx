import React, { useState, useEffect } from "react";
import LoginCard from "./LoginCard"; // اطمینان حاصل کنید که مسیر درست است
import { Link, useNavigate } from "react-router-dom"; // useNavigate را اضافه کنید

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [results, setResults] = useState([]);

  // --- State های جدید برای اطلاعات کاربر ---
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // برای تشخیص وضعیت ورود

  const navigate = useNavigate(); // برای هدایت کاربر

  useEffect(() => {
    // --- خواندن اطلاعات کاربر از localStorage ---
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUserName(parsedUserData.fullName || ''); // اطمینان از وجود fullName
        setUserAvatar(parsedUserData.profileImage || ''); // اطمینان از وجود profileImage
        setIsLoggedIn(true); // کاربر وارد شده است
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setIsLoggedIn(false); // اگر پارس کردن خطا داد، یعنی لاگین نیست
      }
    } else {
      setIsLoggedIn(false); // اگر userData در localStorage نبود
    }

    // --- دریافت لیست محصولات (کد قبلی شما) ---
    fetch("https://api.baran-academy.ir/api/home/web/cafe/menu")
      .then((res) => res.json())
      .then((data) => {
        const products = data.data.flatMap((cat) =>
          cat.items.map((item) => ({ ...item, categoryId: cat.id }))
        );
        setAllProducts(products);
      })
      .catch(error => console.error("Error fetching products:", error)); // اضافه کردن مدیریت خطا برای fetch

  }, []); // این useEffect فقط یک بار در ابتدای بارگذاری هدر اجرا می‌شود

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 1) {
      const filtered = allProducts.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  // --- تابع برای خروج از حساب کاربری (Logout) ---
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token'); // اگر توکن هم ذخیره می‌کنید
    setUserName('');
    setUserAvatar('');
    setIsLoggedIn(false);
    // می‌توانید کاربر را به صفحه اصلی هدایت کنید یا در صفحه فعلی نگه دارید
    navigate("/"); // هدایت به صفحه اصلی پس از خروج
  };

  return (
    <>
      <div className="bg-c">
     <div id="home-titel-welcome">
          به <span>کافه کد</span> خوش آمدید
        </div>

        <div className="search-wrapper">
          <div className="search-box">
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button>🔍</button>
          </div>

          {/* --- نمایش اطلاعات کاربر یا دکمه ورود --- */}
          {isLoggedIn ? (
            <div className="login-info">
              {userAvatar && (
                <img
                  src={userAvatar} // عکس Base64
                  alt="Avatar"
                  className="img-log"
                 
                />
              )}
              <span>{userName}</span>
              <button onClick={handleLogout} >
                خروج
              </button>
            </div>
          ) : (
            <Link
              to="/LoginCard" // یا هر مسیری که فرم لاگین در آن قرار دارد
              className="log-bt"
            >
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="25" width="25" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </Link>
          )}
          {/* --- پایان نمایش اطلاعات کاربر --- */}

          {/* لیست نتایج جستجو */}
          {results.length > 0 && (
            <div className="results-list" style={{ top: 'calc(100% + 5px)' /* تنظیم موقعیت لیست نتایج */ }}>
              {results.map((item) => (
                <div key={item.slug}
                  onClick={() => {
                    setResults([]); // بستن لیست
                    setSearchTerm(""); // پاک کردن فیلد جستجو
                    // اگر می‌خواهید با کلیک روی نتیجه به صفحه محصول بروید، از navigate استفاده کنید
                    // navigate(`/product/${item.slug}`);
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                  style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee' }}
                >
                  <img src={item.image_link} alt={item.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: "right", flexGrow: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                    <div style={{ fontSize: '0.9em', color: '#555' }}>{item.price} تومان</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
      </div>
    </>
  );
}

export default Header;
