  import React, { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import Pagination from "./Pagination";


  function Menu({ addToCart }) {
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("همه");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const[currentPage,setCurrentPage]=useState(1);
    const productsPerPage=5;

    // --- دریافت داده‌ها از API ---
    useEffect(() => {
      
      fetch("https://api.baran-academy.ir/api/home/web/cafe/menu")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setCategories(data.data);

          const products = data.data.flatMap((cat) =>
            cat.items.map((item) => {
              const priceAsNumber = parseFloat(item.price);
              return {
                
                ...item,
                categoryId: cat.id,
                categoryTitle: cat.title,
                price: isNaN(priceAsNumber) ? 0 : priceAsNumber,
              };
            })
          );

          setAllProducts(products);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching menu data:", err);
          setError("خطا در بارگذاری منوی کافه، لطفاً دوباره تلاش کنید.");
          setLoading(false);
        });
    }, []);

    if (loading)
      return (
        <h3>
          در حال بارگذاری...
        </h3>
      );
    if (error)
      return (
        <h3 >
          {error}
        </h3>
      );

    // --- فیلتر محصولات بر اساس دسته‌بندی ---
    const filteredProducts =
      selectedCategory === "همه"
        ? allProducts
        : allProducts.filter((p) => p.categoryId === selectedCategory);

        const indexOfLastProduct=currentPage * productsPerPage;
        const indexOfFirstProduct=indexOfLastProduct-productsPerPage;
        const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    return (
      <div>
      <div className="mbt">
        <h2
          id="mm"
        
        >
          منوی کافه
        </h2>
        </div>

        {/* لینک به صفحه‌ی سبد خرید */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <Link
            to="/shopping"
          className="nmc"
          >
            مشاهده‌ٔ سبد خرید
          </Link>
        </div>

        {/* دکمه‌های دسته‌بندی */}
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <button
            onClick={() =>{
              setSelectedCategory("همه");
              setCurrentPage(1)
            }}
            className={`btn-select ${selectedCategory === "همه" ? "active" : ""}`}
            
          >
            همه
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>{
                 setSelectedCategory(cat.id)
                setCurrentPage(1);
                }
            
            }
              className={`btn-select ${selectedCategory === cat.id ? "active" : ""}`}
        
              
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* نمایش محصولات */}
        <div
          className="cw"
        
        >
          {currentProducts.map((item) => (
            <div
              key={item.slug}
              className="bw"
            
            >
              <div className="product-info">
                <h4
                
                >
                  {item.title}
                </h4>

                <strong>
                  قیمت:{" "}
                  {typeof item.price === "number"
                    ? item.price.toLocaleString("fa-IR")
                    : item.price}{" "}
                  تومان
                </strong>

                <p
              
                >
                  {item.description}
                </p>

                <img
                className="pi"
                  src={item.image_link}
                  alt={item.title} 
                />
              </div>

              {/* دکمه افزودن به سبد خرید */}
              <div >
              <button
    className="cart-main-btn"
    onClick={() => {
      console.log("Item being added from Menu:", item); // <-- این خط رو اضافه کنید
      addToCart({ id: item.id || item.slug, ...item });
    }}
  >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>افزودن به سفارش</span>
                </button>
              </div>
            </div>
          ))}
        </div>
         {totalPages > 1 && (
           <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onePageChange={setCurrentPage}
        />
      )}



      </div>
    );
  }

  export default Menu;
