import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";



export default function LoginCard() {
  const [step, setStep] = useState("phone"); // مراحل: "phone", "verify", "completeProfile"
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false); // وضعیت بارگذاری کلی
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState(""); // توکن موقت برای مرحله تایید
  const navigate = useNavigate();

const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true); // شروع با دکمه غیرفعال
  const [message, setMessage] = useState(''); // برای نمایش پیام موفقیت یا خطا
  
  
  // --- تابع برای پاک کردن خطا هنگام شروع ورودی جدید ---
  const clearError = () => {
    if (error) setError("");
  };

  // --- مرحله ورود شماره موبایل ---
  const handleSendPhone = async (e) => {
    e.preventDefault();
    if (!phone || phone.length !== 11 || !phone.startsWith('0')) { // اعتبارسنجی اولیه شماره موبایل
        setError("لطفاً شماره موبایل معتبر 11 رقمی (با صفر) وارد کنید.");
        return;
    }
    setLoading(true);
    setError(""); // پاک کردن خطای قبلی

    try {
      const formattedPhone = phone.startsWith('0') ? phone.substring(1) : phone; // حذف صفر ابتدایی برای API

      const response = await fetch(
        "https://api.baran-academy.ir/api/authorize/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country_code: "ir",
            login: formattedPhone, // استفاده از شماره فرمت شده
            status: 0,
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      // اطمینان از اینکه پاسخ شامل 'ok' و 'token' است
      if (response.ok && data.ok === true && data.data?.token) {
        setTempToken(data.data.token);
        setStep("verify"); // رفتن به مرحله تایید کد
      } else {
        // نمایش خطای دریافتی از API یا پیام پیش‌فرض
        setError(data.message || data.errors?.[0] || "خطا در ارسال کد تأیید. لطفاً دوباره امتحان کنید.");
      }
    } catch (err) {
      console.error("Send phone error:", err);
      setError("خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setLoading(false); // پایان بارگذاری در هر صورت
    }
  };








 const handleRequestResend = () => {
    setMessage(''); // پاک کردن پیام قبلی
    setIsResendDisabled(true); // غیرفعال کردن دکمه بلافاصله
    setResendTimer(60); // تنظیم مجدد تایمر به 60 ثانیه

    // --- اینجا منطق ارسال درخواست به سرور را قرار دهید ---
    // مثلاً با fetch یا axios
    console.log("Sending resend code request...");
    // فرض کنید درخواست موفقیت آمیز بود
    // اگر درخواست ناموفق بود، باید setError یا setMessage مناسب را فراخوانی کنید
    // و setIsResendDisabled(false) را برای فعال کردن دوباره دکمه صدا بزنید.

    // اگر درخواست موفق بود، تایمر از طریق useEffect شروع به کار خواهد کرد
    // نیازی نیست اینجا setInterval را صدا بزنید
  };

  // useEffect برای مدیریت تایمر
useEffect(() => {
    let intervalId = null;

    if (isResendDisabled && resendTimer > 0) {
      // اگر دکمه غیرفعال است و تایمر هنوز تمام نشده، تایمر را راه‌اندازی کن
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      // اگر تایمر به صفر رسید
      setIsResendDisabled(false); // دکمه را فعال کن
      // setMessage('می‌توانید کد را مجدداً ارسال کنید.'); // پیام اختیاری
    }

    // تابع پاکسازی: برای جلوگیری از memory leak
    return () => {
      // *** اصلاح زیر: clearInterval به جای clearIn ***
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isResendDisabled, resendTimer]); // اضافه کردن وابستگی‌ها به آرایه
















  // --- مرحله تایید کد ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 4) { // اعتبارسنجی کد
        setError("کد تایید باید 6 رقمی باشد.");
        return;
    }
    setLoading(true);
    setError(""); // پاک کردن خطای قبلی

    try {
      // شماره موبایل برای API verify لازم نیست، فقط token و code کافی است
      const response = await fetch(
        "https://api.baran-academy.ir/api/authorize/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            token: tempToken // استفاده از توکن موقت ذخیره شده
          }),
        }
      );

      const data = await response.json();
      console.log("Verify response:", data);

      if (response.ok && data.ok === true && data.data?.token) {
        // توکن نهایی را ذخیره کنید
        localStorage.setItem("token", data.data.token);
        // بررسی کنید آیا اطلاعات کاربر قبلاً ذخیره شده است
          if (localStorage.getItem("userData")) {
          // اگر کاربر وجود دارد، به صفحه اصلی هدایت کنید
          navigate("/");
        } else {
          // اگر کاربر وجود ندارد، به مرحله تکمیل پروفایل بروید
          setStep("completeProfile");
        }
      } else {
        // نمایش خطای دریافتی از API یا پیام پیش‌فرض
        setError(data.message || data.errors?.[0] || "کد تأیید اشتباه یا منقضی شده است.");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      setError("خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setLoading(false); // پایان بارگذاری
    }
  };

  // --- مرحله تکمیل پروفایل ---
  const handleCompleteProfile = (e) => {
    e.preventDefault();

    // اعتبارسنجی ورودی‌های پروفایل
    if (!fullName || !profileImage) {
    setError("لطفاً تمام فیلدها را تکمیل کنید.");
   return;
  }

  setLoading(true);

  // تبدیل فایل به Base64 برای ذخیره در localStorage
  const reader = new FileReader();
  reader.onloadend = () => {
    const userData = {
      fullName: fullName,
      profileImage: reader.result, // این همون رشته Base64 تصویره
    };

    // ذخیره در localStorage
    localStorage.setItem("userData", JSON.stringify(userData));

    setLoading(false);
    // اینجا می‌تونی کاربر رو به صفحه اصلی هدایت کنی
    alert("پروفایل با موفقیت تکمیل شد!");
    navigate("/");
  };
  
  reader.readAsDataURL(profileImage);
};

  // --- مدیریت آپلود تصویر پروفایل ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // اعتبارسنجی نوع فایل
      if (!file.type.startsWith("image/")) {
        setError("لطفاً فقط فایل تصویری انتخاب کنید.");
        return;
      }
      // اعتبارسنجی حجم فایل (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("حجم فایل نباید بیشتر از 2 مگابایت باشد.");
        return;
      }

      setProfileImage(file); // ذخیره فایل تصویر
      setError(""); // پاک کردن خطا در صورت انتخاب صحیح
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* دکمه بازگشت فقط در مراحل ورود و تایید */}
        {(step === "phone" || step === "verify") && (
          <Link to="/" className="backButton">
            <FaArrowLeft size={18} />
          </Link>
        )}

        <h2 className="login-logo">{"{"}کافه کُد ☕️{"}"}</h2>

        {/* نمایش پیام خطا در بالای فرم */}
        {error && <div className="error-message">{error}</div>}

        {/* فرم ورود شماره موبایل */}
        {step === "phone" && (
          <form onSubmit={handleSendPhone}>
            <div className="form-group">
              <label htmlFor="phone">شماره موبایل</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                    // اجازه ورود فقط به اعداد و حداکثر 11 رقم
                    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                    setPhone(newValue);
                    clearError(); // پاک کردن خطا هنگام تایپ
                }}
                placeholder="مثال: 09123456789"
                required
                disabled={loading} // غیرفعال کردن در زمان بارگذاری
                className="login-input"
              />
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading || !phone || phone.length !== 11 || !phone.startsWith('0')} // دکمه غیرفعال است اگر در حال بارگذاری باشد یا ورودی نامعتبر باشد
            >
              {loading ? "در حال ارسال..." : "ارسال کد تایید"}
            </button>
          </form>
        )}

        {/* فرم تایید کد */}
        {step === "verify" && (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label htmlFor="code">کد تایید</label>
              <input
                type="tel"
                id="code"
                value={code}
                onChange={(e) => {
                    // اجازه ورود فقط به اعداد و حداکثر 4 رقم
                    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                    setCode(newValue);
                    clearError();
                }}
                placeholder="----" // تغییر placeholder برای 4 رقمی بودن
                maxLength={4} // *** تغییر maxLength به 4 ***
                required
                disabled={loading}
                className="login-input"
                autoFocus
              />
              {/* دکمه ارسال مجدد کد (اختیاری) */}
              <button
        onClick={handleRequestResend}
        disabled={isResendDisabled} // دکمه غیرفعال است اگر isResendDisabled درست باشد
      >
        {isResendDisabled
          ? `ارسال مجدد بعد از ${resendTimer} ثانیه`
          : 'ارسال مجدد کد'}
      </button>
            </div>
            <button
              type="submit"
              className="login-button"
              // *** تغییر شرط اعتبارسنجی به 4 رقم ***
              disabled={loading || !code || code.length !== 4}
            >
              {loading ? "در حال بررسی..." : "تایید کد"}
            </button>
          </form>
        
        )}

        {/* فرم تکمیل پروفایل */}
        {step === "completeProfile" && (
          <form onSubmit={handleCompleteProfile} className="profile-form">
             <div className="form-group">
              <label htmlFor="fullName">نام و نام خانوادگی</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                    setFullName(e.target.value);
                    clearError();
                }}
                placeholder="نام و نام خانوادگی شما"
                required
                className="login-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profileImage" className="image-upload-label">
                {profileImage ? profileImage.name : "انتخاب عکس پروفایل"}
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*" // فقط پذیرش فایل‌های تصویری
                onChange={handleImageUpload}
                required
                className="file-input" // استایل برای فایل اینپوت
              />
              {profileImage && (
                <div className="profile-image-preview">
                  <p>پیش‌نمایش:</p>
                  <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" width="100" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="login-button"
              disabled={loading || !fullName || !profileImage} // دکمه غیرفعال اگر نام یا عکس وارد نشده باشد
            >
              {loading ? "در حال ذخیره..." : "تکمیل پروفایل"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
