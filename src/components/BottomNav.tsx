import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/seances', label: 'Séances', icon: '🏋️' },
  { to: '/historique', label: 'Historique', icon: '📅' },
  { to: '/reglages', label: 'Réglages', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-sm font-medium ${
                isActive ? 'text-sky-400' : 'text-zinc-400'
              }`
            }
          >
            <span className="text-2xl">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
