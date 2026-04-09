import useLoginController from './useLoginController';

function ErrorHint({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="text-red-500 text-xs mt-2 flex items-center gap-1.5">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{message}</span>
    </div>
  );
}

function LoginPanel() {
  const {
    formData,
    fieldErrors,
    submitError,
    showPassword,
    isLoading,
    canSubmit,
    onChange,
    onSubmit,
    onTogglePassword
  } = useLoginController();

  return (
    <div className="md:w-[55%] p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center animate-slideInRight">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#022758] to-[#1A3A5C] bg-clip-text text-transparent mb-1">
            Sign In
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">Please enter your credentials to continue</p>
        </div>

        <form className="space-y-5 md:space-y-6" onSubmit={onSubmit}>
          <div className="group">
            <label
              htmlFor="userName"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 tracking-wide"
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your username"
              className="w-full px-1 py-3 sm:py-3.5 text-sm sm:text-base border-b-2 border-gray-300 transition-all duration-300 bg-transparent focus:outline-none focus:border-[#022758] placeholder:text-gray-400 hover:border-gray-400"
              value={formData.userName}
              onChange={(e) => onChange('userName', e.target.value)}
              required
            />
            <ErrorHint message={fieldErrors.userName} />
          </div>

          <div className="group">
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-1 py-3 sm:py-3.5 pr-10 text-sm sm:text-base border-b-2 border-gray-300 transition-all duration-300 bg-transparent focus:outline-none focus:border-[#022758] placeholder:text-gray-400 hover:border-gray-400"
                value={formData.password}
                onChange={(e) => onChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#022758] focus:outline-none"
                onClick={onTogglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  className={showPassword ? 'hidden' : ''}
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={showPassword ? '' : 'hidden'}
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <ErrorHint message={fieldErrors.password} />
          </div>

          {submitError ? (
            <div className="text-red-500 text-xs sm:text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {submitError}
            </div>
          ) : null}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-shine w-full px-6 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#022758] to-[#1A3A5C] rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(2,39,88,0.35)] hover:shadow-[0_12px_28px_rgba(2,39,88,0.45)] hover:-translate-y-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-[#e0f0f0] rounded-lg border border-[#80a0a0]">
          <p className="text-xs font-semibold text-[#022758] mb-1.5 text-center">Demo Credentials</p>
          <div className="text-xs text-[#022758] space-y-0.5">
            <p>
              <span className="font-semibold">Username:</span> admin
            </p>
            <p>
              <span className="font-semibold">Password:</span> admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-3 sm:p-6 md:p-8 min-h-screen">
      <div
        className="w-full max-w-6xl rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row"
        style={{ maxHeight: '95vh' }}
      >
        <div className="bg-gradient-blue relative md:w-[45%] p-12 flex items-center justify-center text-center text-white overflow-hidden">
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-0">
            <div className="flex justify-center items-center p-8">
              <img
                src="/assets/orbit-logo.png"
                alt="Orbit Engineers"
                className="w-full max-w-sm h-auto object-contain"
              />
            </div>
            <div className="text-center"></div>
          </div>
        </div>

        <LoginPanel />
      </div>
    </div>
  );
}