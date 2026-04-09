import useCardsController from './useCardsController';

function TopNav({ onSignOut }) {
  return (
    <nav className="sticky top-0 z-20 text-white" style={{ background: 'var(--primary)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black"
              style={{ color: 'var(--primary)' }}
            >
              F
            </div>
            <div className="font-bold text-lg text-white">Orbit</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-white/90 hidden sm:block">Hello, Admin</div>
            <button
              onClick={onSignOut}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-semibold shadow hover:scale-105 transition-transform"
              title="Sign out"
              style={{ color: 'var(--primary)' }}
            >
              A
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function DashboardHeader() {
  return (
    <div className="text-center mb-10 sm:mb-12">
      <div className="mb-4">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-2xl mb-3"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2 tracking-tight">
        Welcome to{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Orbit
        </span>
      </h1>
      <p className="text-base sm:text-lg text-gray-600 font-medium">Manufacturing Execution System</p>
    </div>
  );
}

function DashboardCard({ card, onOpen }) {
  const subtitleClass =
    card.subtitleClass || 'text-xs font-medium relative z-10';

  return (
    <div
      className="cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
      onClick={() => onOpen(card.target)}
    >
      <div
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-colors h-full"
        style={{ borderColor: 'var(--primary)' }}
      >
        <div
          className="p-4 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary), var(--primary-light))'
          }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-1 flex items-center justify-center bg-white/15 backdrop-blur-sm shadow-lg relative z-10">
            <i className={`${card.iconClass} text-3xl text-white`}></i>
          </div>
          <h3 className="text-2xl font-black text-white mb-1 relative z-10">{card.title}</h3>
          <p className={subtitleClass} style={{ color: card.subtitleClass ? undefined : 'rgba(255,255,255,0.8)' }}>
            {card.subtitle}
          </p>
        </div>
        <div className="p-4" style={{ background: 'linear-gradient(135deg, rgba(2,39,88,0.1), white)' }}>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold text-xs">View</span>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(2,39,88,0.2)' }}
            >
              <i className="fas fa-arrow-right text-xs" style={{ color: 'var(--primary)' }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsPage() {
  const { cards, onOpenCard, onSignOut } = useCardsController();

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      <TopNav onSignOut={onSignOut} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <DashboardHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((card) => (
            <DashboardCard key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </div>
      </main>
    </div>
  );
}
