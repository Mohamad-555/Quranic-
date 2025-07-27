// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { NGROK_BASE_URL } from "../data/mockData";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      // ❗️غالبًا لازم تنشئ endpoint لهذا الطلب على الباك
      const url = `${NGROK_BASE_URL}/forgot-password`;
      const res = await axios.post(url, { email });

      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.");
    } catch (error) {
      setMessage("حدث خطأ أثناء الإرسال. تأكد من البريد الإلكتروني.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-cairo font-bold text-center mb-4">
          استعادة كلمة المرور
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded font-cairo"
          />
          <button
            type="submit"
            className="w-full bg-islamic-primary text-white py-2 rounded font-cairo hover:bg-islamic-light"
          >
            إرسال رابط إعادة التعيين
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center font-cairo text-sm text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
