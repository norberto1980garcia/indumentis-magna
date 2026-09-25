import React, { useState } from 'react';
import { X, LogOut, Lock, Settings } from 'lucide-react';
import { AppUser } from '../types';
import { StoreDB } from '../services/storeDb';
import { INITIAL_USERS } from '../data/seedData';

interface AuthModalProps {
isOpen: boolean;
onClose: () => void;
currentUser: AppUser | null;
onUserChange: (user: AppUser | null) => void;
onOpenAdmin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
isOpen,
onClose,
currentUser,
onUserChange,
onOpenAdmin,
}) => {
const [tab, setTab] = useState<'login' | 'register'>('login');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [name, setName] = useState('');
const [isAuthenticating, setIsAuthenticating] = useState(false);
const [oauthStep, setOauthStep] = useState<string | null>(null);

if (!isOpen) return null;

const canAccessAdmin =
currentUser?.role === 'admin' ||
currentUser?.role === 'seller' ||
currentUser?.permissions.canEditInventory === true;

const handleGoogleOAuth = () => {
setIsAuthenticating(true);
setOauthStep('Conectando con Google OAuth2...');


setTimeout(() => {
  setOauthStep('Verificando credenciales seguras...');

  setTimeout(() => {
    const googleUser: AppUser = {
      id: `usr-google-${Date.now()}`,
      name: 'Betin Magna (Google User)',
      email: 'betin1980eyb@gmail.com',
      role: 'admin',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      authProvider: 'google',
      phone: '+54 9 11 5824-9120',
      createdAt: new Date().toISOString(),
      permissions: {
        canEditInventory: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageCoupons: true,
        canManageUsers: true,
        canSendWhatsApp: true,
      },
    };

    StoreDB.setCurrentUser(googleUser);
    onUserChange(googleUser);
    setIsAuthenticating(false);
    setOauthStep(null);
    onClose();
  }, 1000);
}, 1000);


};

const handleEmailAuth = (e: React.FormEvent) => {
e.preventDefault();
setIsAuthenticating(true);


setTimeout(() => {
  const newUser: AppUser = {
    id: `usr-${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    role: 'customer',
    authProvider: 'email',
    createdAt: new Date().toISOString(),
    permissions: {
      canEditInventory: false,
      canManageOrders: false,
      canViewAnalytics: false,
      canManageCoupons: false,
      canManageUsers: false,
      canSendWhatsApp: false,
    },
  };

  StoreDB.setCurrentUser(newUser);
  onUserChange(newUser);
  setIsAuthenticating(false);
  onClose();
}, 800);


};

const handleSelectDemoUser = (user: AppUser) => {
StoreDB.setCurrentUser(user);
onUserChange(user);
onClose();
};

const handleLogout = () => {
StoreDB.setCurrentUser(null);
onUserChange(null);
onClose();
};

return ( <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"> <div className="relative w-full max-w-md bg-[#120f1a] border border-purple-900/60 rounded-2xl shadow-2xl overflow-hidden">


    {/* Header */}
    <div className="bg-zinc-950 px-6 py-4 border-b border-purple-900/40 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-purple-400" />
        <h3 className="text-base font-bebas tracking-wider text-white">
          {currentUser ? 'MI PERFIL & SEGURIDAD' : 'AUTENTICACIÓN OAUTH2'}
        </h3>
      </div>

      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <div className="p-6 space-y-6">

      {currentUser ? (
        <div className="space-y-4">

          {/* User information */}
          <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-purple-900/40">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border border-purple-500"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-600 flex items-center justify-center text-purple-300 font-bold">
                {currentUser.name[0]}
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-white">
                {currentUser.name}
              </h4>

              <p className="text-xs text-zinc-400">
                {currentUser.email}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-purple-900/80 text-purple-200 border border-purple-500/50 rounded text-[10px] font-mono font-bold uppercase">
                  ROL: {currentUser.role}
                </span>

                <span className="text-[10px] text-zinc-500 font-mono">
                  OAuth: {currentUser.authProvider.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs space-y-1.5">
            <span className="text-zinc-400 font-bold block mb-1">
              Permisos habilitados:
            </span>

            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <span
                className={
                  currentUser.permissions.canEditInventory
                    ? 'text-green-400'
                    : 'text-zinc-600 line-through'
                }
              >
                ✓ Editar Inventario
              </span>

              <span
                className={
                  currentUser.permissions.canManageOrders
                    ? 'text-green-400'
                    : 'text-zinc-600 line-through'
                }
              >
                ✓ Gestionar Pedidos
              </span>

              <span
                className={
                  currentUser.permissions.canViewAnalytics
                    ? 'text-green-400'
                    : 'text-zinc-600 line-through'
                }
              >
                ✓ Ver Analíticas
              </span>

              <span
                className={
                  currentUser.permissions.canSendWhatsApp
                    ? 'text-green-400'
                    : 'text-zinc-600 line-through'
                }
              >
                ✓ Contactar WhatsApp
              </span>
            </div>
          </div>

          {/* Private management access */}
          {canAccessAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-all shadow-[0_0_18px_rgba(168,85,247,0.25)] flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              PANEL DE GESTIÓN
            </button>
          )}

          {/* Demo roles */}
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-semibold">
              Cambiar de rol para pruebas:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {INITIAL_USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectDemoUser(u)}
                  className={`py-1.5 px-2 rounded text-center text-xs font-mono font-bold transition-all border ${
                    currentUser.id === u.id
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-purple-600'
                  }`}
                >
                  {u.role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 rounded-xl text-xs font-bold font-montserrat flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>CERRAR SESIÓN</span>
          </button>

        </div>
      ) : (

        /* Login / Register */
        <div className="space-y-4">

          {/* Google */}
          <button
            onClick={handleGoogleOAuth}
            disabled={isAuthenticating}
            className="w-full py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-montserrat font-bold text-xs tracking-wider rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-98 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53-2.6H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>

            <span>CONTINUAR CON GOOGLE (OAUTH2)</span>
          </button>

          {oauthStep && (
            <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-lg text-center text-xs text-purple-300 font-mono animate-pulse">
              {oauthStep}
            </div>
          )}

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-zinc-500 text-[10px] uppercase font-mono">
              O con email y contraseña
            </span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Email */}
          <form onSubmit={handleEmailAuth} className="space-y-3">

            {tab === 'register' && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Contraseña
              </label>

              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-colors shadow"
            >
              {tab === 'login' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
            </button>
          </form>

          {/* Tabs */}
          <div className="text-center text-xs text-zinc-500">
            {tab === 'login' ? (
              <span>
                ¿No tenés cuenta?{' '}
                <button
                  onClick={() => setTab('register')}
                  className="text-purple-400 font-bold hover:underline"
                >
                  Registrate
                </button>
              </span>
            ) : (
              <span>
                ¿Ya tenés cuenta?{' '}
                <button
                  onClick={() => setTab('login')}
                  className="text-purple-400 font-bold hover:underline"
                >
                  Iniciá sesión
                </button>
              </span>
            )}
          </div>

          {/* Demo users */}
          <div className="pt-3 border-t border-zinc-900">
            <p className="text-[11px] text-zinc-400 font-semibold mb-2 text-center">
              Acceso rápido de prueba (1 clic):
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoUser(INITIAL_USERS[0])}
                className="py-1.5 px-2 bg-zinc-900 hover:bg-purple-950 border border-purple-900/60 hover:border-purple-500 rounded text-center text-[10px] font-bold text-purple-300 transition-colors"
              >
                👑 Admin
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser(INITIAL_USERS[1])}
                className="py-1.5 px-2 bg-zinc-900 hover:bg-purple-950 border border-purple-900/60 hover:border-purple-500 rounded text-center text-[10px] font-bold text-cyan-300 transition-colors"
              >
                🏷️ Vendedor
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser(INITIAL_USERS[2])}
                className="py-1.5 px-2 bg-zinc-900 hover:bg-purple-950 border border-purple-900/60 hover:border-purple-500 rounded text-center text-[10px] font-bold text-zinc-300 transition-colors"
              >
                👟 Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>


);
};
