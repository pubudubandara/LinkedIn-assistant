'use client';

export default function Home() {
  const handleLogin = () => {
    // Redirect to backend auth URL
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/linkedin`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="text-center space-y-8 p-12 bg-white shadow-2xl rounded-3xl border border-gray-100 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-blue-700 leading-tight">
            LinkedIn AI Assistant
          </h1>
          <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>
        
        <p className="text-gray-600 text-xl max-w-lg mx-auto leading-relaxed">
          Supercharge your LinkedIn presence with AI-generated posts tailored to your professional profile and goals.
        </p>
        
        <div className="pt-4">
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-4 mx-auto text-lg group"
          >
            {/* LinkedIn Icon (SVG) */}
            <svg className="w-7 h-7 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            Sign in with LinkedIn
          </button>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Connect your LinkedIn account to get started. Your data is secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}