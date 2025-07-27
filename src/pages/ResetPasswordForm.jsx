import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Save } from "lucide-react";
import { NGROK_BASE_URL } from "../data/mockData";

const ResetPasswordForm = () => {
  const { token } = useParams(); // قراءة التوكن من الرابط
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      await axios.post(`${NGROK_BASE_URL}/reset-password`, {
        token,
        password,
      });

      setMessage("تم تحديث كلمة المرور. سيتم توجيهك...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "حدث خطأ أثناء تعيين كلمة المرور.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-islamic-pattern px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-cairo font-bold mb-6 text-center text-islamic-dark">
          إعادة تعيين كلمة المرور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg font-cairo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg font-cairo"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-islamic-primary text-white py-3 px-4 rounded-lg font-cairo font-bold hover:bg-islamic-light transition"
          >
            <Save size={18} className="inline ml-2" />
            حفظ كلمة المرور
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-cairo text-sm text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
