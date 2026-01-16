import React, { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    setExplanation("");

    try {
      // CRA uses process.env.REACT_APP_*
      const backendUrl =
        process.env.REACT_APP_BACKEND_URL ||
        "https://codeinsight-backend.onrender.com";

      const res = await axios.post(`${backendUrl}/api/explain`, { code });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error("Backend Error:", err);
      setExplanation(
        "Error: " +
          (err.response?.data?.error?.message || err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-3xl bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">
          CodeInsight — AI Code Summarizer
        </h1>

        <textarea
          rows="10"
          className="w-full p-4 rounded-lg bg-slate-950 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Write your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex justify-center mt-5">
          <button
            onClick={handleExplain}
            disabled={loading || !code.trim()}
            className={`px-6 py-3 rounded-lg font-medium ${
              loading
                ? "bg-cyan-800 cursor-wait"
                : "bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300"
            } text-black transition-all`}
          >
            {loading ? "Explaining..." : "Explain Code"}
          </button>
        </div>

        {explanation && (
          <div className="mt-8 bg-slate-950 border border-slate-700 rounded-xl p-6 text-slate-200 whitespace-pre-wrap">
            <h2 className="text-xl font-semibold text-cyan-400 mb-3">
              Explanation:
            </h2>
            <p className="leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>

      <footer className="mt-8 text-slate-500 text-sm">
        By Vaish Arya
      </footer>
    </div>
  );
}

export default App;
