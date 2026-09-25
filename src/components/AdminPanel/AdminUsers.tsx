import React, { useState } from 'react';
import { Users, Shield, Plus, Check, X } from 'lucide-react';
import { AppUser, UserRole } from '../../types';
import { StoreDB } from '../../services/storeDb';

interface AdminUsersProps {
  users: AppUser[];
  onUsersUpdated: () => void;
  currentUser: AppUser | null;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onUsersUpdated, currentUser }) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'seller' as UserRole
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    StoreDB.updateUserRole(userId, newRole);
    onUsersUpdated();
  };

  const handlePermissionToggle = (userId: string, permissionKey: keyof AppUser['permissions']) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updatedPermissions = {
      ...user.permissions,
      [permissionKey]: !user.permissions[permissionKey]
    };

    StoreDB.updateUserRole(userId, user.role, updatedPermissions);
    onUsersUpdated();
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: AppUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      permissions: {
        canEditInventory: newUser.role === 'admin' || newUser.role === 'seller',
        canManageOrders: newUser.role === 'admin' || newUser.role === 'seller',
        canViewAnalytics: newUser.role === 'admin',
        canManageCoupons: newUser.role === 'admin',
        canManageUsers: newUser.role === 'admin',
        canSendWhatsApp: true
      }
    };

    const currentUsers = StoreDB.getUsers();
    currentUsers.push(user);
    StoreDB.saveUsers(currentUsers);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: 'seller' });
    onUsersUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bebas tracking-wide text-white">
            GESTIÓN DE USUARIOS Y CONTROL DE PERMISOS
          </h2>
          <p className="text-xs text-zinc-400">
            Administrá roles del equipo (Admin, Vendedores y Clientes) y controlá el acceso a funciones críticas.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO USUARIO</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-950 border border-purple-900/40 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Email / Teléfono</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Pedidos</th>
                <th className="py-3 px-4 text-center">Analíticas</th>
                <th className="py-3 px-4 text-center">Cupones</th>
                <th className="py-3 px-4 text-center">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                  {/* User Profile */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-purple-500/50" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-600 flex items-center justify-center text-purple-300 font-bold">
                        {u.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <span className="text-[10px] text-zinc-500 font-mono">ID: {u.id}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-zinc-300">
                    <p>{u.email}</p>
                    <p className="text-[11px] text-purple-400 font-mono">{u.phone || 'Sin teléfono'}</p>
                  </td>

                  {/* Role Selector */}
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                      className={`px-2 py-1 rounded text-xs font-mono font-bold uppercase focus:outline-none border ${
                        u.role === 'admin'
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : u.role === 'seller'
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      <option value="admin">ADMINISTRADOR</option>
                      <option value="seller">VENDEDOR</option>
                      <option value="customer">CLIENTE</option>
                    </select>
                  </td>

                  {/* Permissions Toggles */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handlePermissionToggle(u.id, 'canEditInventory')}
                      className={`p-1 rounded ${u.permissions.canEditInventory ? 'text-green-400 bg-green-950/60' : 'text-zinc-600 bg-zinc-900'}`}
                    >
                      {u.permissions.canEditInventory ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handlePermissionToggle(u.id, 'canManageOrders')}
                      className={`p-1 rounded ${u.permissions.canManageOrders ? 'text-green-400 bg-green-950/60' : 'text-zinc-600 bg-zinc-900'}`}
                    >
                      {u.permissions.canManageOrders ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handlePermissionToggle(u.id, 'canViewAnalytics')}
                      className={`p-1 rounded ${u.permissions.canViewAnalytics ? 'text-green-400 bg-green-950/60' : 'text-zinc-600 bg-zinc-900'}`}
                    >
                      {u.permissions.canViewAnalytics ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handlePermissionToggle(u.id, 'canManageCoupons')}
                      className={`p-1 rounded ${u.permissions.canManageCoupons ? 'text-green-400 bg-green-950/60' : 'text-zinc-600 bg-zinc-900'}`}
                    >
                      {u.permissions.canManageCoupons ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handlePermissionToggle(u.id, 'canSendWhatsApp')}
                      className={`p-1 rounded ${u.permissions.canSendWhatsApp ? 'text-green-400 bg-green-950/60' : 'text-zinc-600 bg-zinc-900'}`}
                    >
                      {u.permissions.canSendWhatsApp ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#120f1a] border border-purple-800/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bebas tracking-wide text-white">
              REGISTRAR MIEMBRO DEL EQUIPO
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lucas Vendedor"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="correo@indumentismagna.com"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+54 9 11 5824-9120"
                  value={newUser.phone}
                  onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">Rol</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                >
                  <option value="seller">VENDEDOR (Operaciones y WhatsApp)</option>
                  <option value="admin">ADMINISTRADOR (Acceso Total)</option>
                  <option value="customer">CLIENTE (Solo Compras)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
