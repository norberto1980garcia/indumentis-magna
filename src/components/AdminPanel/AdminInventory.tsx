import React, { useState } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  Edit3,
  Trash2,
  Check,
  Camera,
  X
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { StoreDB } from '../../services/storeDb';
import { ImageUploadField } from './ImageUploadField';

interface AdminInventoryProps {
  products: Product[];
  onProductsUpdated: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  products,
  onProductsUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODOS');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Quick inline price edit
  const [editingPrice, setEditingPrice] = useState<Record<string, number>>({});

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    category: 'CALZADO',
    price: 98999,
    originalPrice: 115000,
    sizes: ['40', '41', '42', '43', '44'],
    stockPerSize: {
      '40': 2,
      '41': 4,
      '42': 5,
      '43': 3,
      '44': 2
    },
    image: '',
    description: '',
    isFeatured: true,
    badge: 'NUEVO INGRESO',
    tags: ['sneakers', 'streetwear', 'nuevo']
  });

  // Change photo modal
  const [photoModalProduct, setPhotoModalProduct] =
    useState<Product | null>(null);

  const [photoModalValue, setPhotoModalValue] = useState<string>('');

  // Full edit product modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // ---------------------------------------------------------
  // FILTER
  // ---------------------------------------------------------

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'TODOS' && p.category !== categoryFilter) {
      return false;
    }

    if (lowStockOnly && p.totalStock > 3) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // ---------------------------------------------------------
  // STOCK
  // ---------------------------------------------------------

  const handleStockChange = (
    productId: string,
    size: string,
    newStock: number
  ) => {
    StoreDB.updateProductStock(
      productId,
      size,
      Math.max(0, newStock)
    );

    onProductsUpdated();
  };

  // ---------------------------------------------------------
  // PRICE
  // ---------------------------------------------------------

  const handlePriceSave = (
    product: Product,
    newPrice: number
  ) => {
    StoreDB.updateProduct({
      ...product,
      price: Math.max(0, newPrice)
    });

    setEditingPrice((prev) => {
      const n = { ...prev };
      delete n[product.id];
      return n;
    });

    onProductsUpdated();
  };

  // ---------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------

  const handleDelete = (productId: string) => {
    if (
      window.confirm(
        '¿Seguro que deseas eliminar este producto del catálogo?'
      )
    ) {
      StoreDB.deleteProduct(productId);
      onProductsUpdated();
    }
  };

  // ---------------------------------------------------------
  // PHOTO
  // ---------------------------------------------------------

  const handleOpenPhotoModal = (product: Product) => {
    setPhotoModalProduct(product);
    setPhotoModalValue(product.image);
  };

  const handleSavePhotoModal = () => {
    if (!photoModalProduct || !photoModalValue) {
      return;
    }

    StoreDB.updateProduct({
      ...photoModalProduct,
      image: photoModalValue
    });

    setPhotoModalProduct(null);
    setPhotoModalValue('');

    onProductsUpdated();
  };

  // ---------------------------------------------------------
  // CREATE PRODUCT
  // ---------------------------------------------------------

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProd.name || !newProd.price || !newProd.image) {
      alert(
        'Por favor completá el nombre, precio y agregá una foto real del producto.'
      );
      return;
    }

    const totalStock = Object.values(
      newProd.stockPerSize || {}
    ).reduce((a, b) => a + b, 0);

    const sku = `MG-${Date.now().toString().slice(-5)}`;

    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      sku,
      name: newProd.name.toUpperCase(),
      subtitle: newProd.subtitle || 'Colección Urbana',
      category:
        (newProd.category as ProductCategory) || 'CALZADO',

      price: Number(newProd.price),

      originalPrice:
        Number(newProd.originalPrice) || undefined,

      sizes:
        newProd.sizes || [
          '40',
          '41',
          '42',
          '43',
          '44'
        ],

      stockPerSize:
        newProd.stockPerSize || {
          '40': 2,
          '41': 2,
          '42': 2,
          '43': 2,
          '44': 2
        },

      totalStock,

      // IMPORTANTE:
      // Ahora solamente utiliza la foto real cargada.
      image: newProd.image,

      description:
        newProd.description ||
        'Artículo original de Indumentis Magna.',

      tags:
        newProd.tags || [
          'nuevo',
          'streetwear'
        ],

      badge: newProd.badge,

      isFeatured: Boolean(newProd.isFeatured),

      createdAt: new Date().toISOString()
    };

    StoreDB.updateProduct(createdProduct);

    // Resetear formulario
    setNewProd({
      name: '',
      subtitle: '',
      category: 'CALZADO',
      price: 98999,
      originalPrice: 115000,
      sizes: ['40', '41', '42', '43', '44'],
      stockPerSize: {
        '40': 2,
        '41': 4,
        '42': 5,
        '43': 3,
        '44': 2
      },
      image: '',
      description: '',
      isFeatured: true,
      badge: 'NUEVO INGRESO',
      tags: ['sneakers', 'streetwear', 'nuevo']
    });

    setIsAddModalOpen(false);

    onProductsUpdated();
  };

  // ---------------------------------------------------------
  // FULL EDIT PRODUCT
  // ---------------------------------------------------------

  const handleSaveEditedProduct = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editingProduct) {
      return;
    }

    const totalStock = Object.values(
      editingProduct.stockPerSize || {}
    ).reduce((a, b) => a + b, 0);

    StoreDB.updateProduct({
      ...editingProduct,
      totalStock
    });

    setEditingProduct(null);

    onProductsUpdated();
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* TOP CONTROLS */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bebas tracking-wide text-white">
            GESTIÓN DE INVENTARIO Y STOCK EN TIEMPO REAL
          </h2>

          <p className="text-xs text-zinc-400">
            Control de existencias por talle y subida directa de fotos reales de productos.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO PRODUCTO</span>
        </button>

      </div>

      {/* REAL PHOTO BANNER */}

      <div className="p-4 bg-gradient-to-r from-purple-950/40 via-zinc-950 to-zinc-950 border border-purple-800/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">

        <div className="flex items-start gap-3">

          <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-600/40 flex items-center justify-center text-purple-400 shrink-0">
            <Camera className="w-4 h-4" />
          </div>

          <div>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>
                Carga de Fotos Reales de Calzado e Indumentaria
              </span>

              <span className="px-1.5 py-0.2 bg-purple-600/60 text-purple-200 text-[9px] rounded font-mono font-normal">
                Directo desde Celular / PC
              </span>
            </h4>

            <p className="text-[11px] text-zinc-400 mt-0.5">
              Hacé clic en el ícono de cámara sobre cualquier producto para subir una foto real desde tu PC o celular. Las imágenes se optimizan automáticamente y se actualizan en la tienda.
            </p>

          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border border-purple-900/40 rounded-xl">

        <div className="flex items-center gap-2 flex-1 min-w-[240px]">

          <Search className="w-4 h-4 text-zinc-500 ml-2" />

          <input
            type="text"
            placeholder="Buscar por nombre, SKU o modelo..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full bg-transparent border-none text-xs text-white focus:outline-none placeholder-zinc-500"
          />

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="TODOS">
              Todas las Categorías
            </option>

            <option value="CALZADO">
              Calzado
            </option>

            <option value="ROPA">
              Ropa
            </option>

            <option value="ACCESORIOS">
              Accesorios
            </option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">

            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) =>
                setLowStockOnly(e.target.checked)
              }
              className="accent-purple-600 rounded"
            />

            <span>
              Stock Crítico (≤3)
            </span>

          </label>

        </div>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="bg-zinc-950 border border-purple-900/40 rounded-xl overflow-hidden shadow-xl">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>

              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase">

                <th className="py-3 px-4">
                  Producto & Foto Real
                </th>

                <th className="py-3 px-4">
                  SKU
                </th>

                <th className="py-3 px-4">
                  Categoría
                </th>

                <th className="py-3 px-4">
                  Precio ($ ARS)
                </th>

                <th className="py-3 px-4">
                  Stock por Talle
                </th>

                <th className="py-3 px-4 text-center">
                  Total Stock
                </th>

                <th className="py-3 px-4 text-right">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-zinc-900">

              {filtered.map((product) => {

                const isEditingP =
                  editingPrice[product.id] !== undefined;

                return (

                  <tr
                    key={product.id}
                    className="hover:bg-zinc-900/40 transition-colors"
                  >

                    {/* PRODUCT */}

                    <td className="py-3 px-4 flex items-center gap-3">

                      <div
                        onClick={() =>
                          handleOpenPhotoModal(product)
                        }
                        className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 group cursor-pointer bg-zinc-900 shrink-0"
                        title="Hacé clic para cambiar foto real"
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">

                          <Camera className="w-4 h-4 text-purple-400" />

                          <span className="text-[8px] font-bold mt-0.5">
                            FOTO
                          </span>

                        </div>

                      </div>

                      <div>

                        <div className="flex items-center gap-2">

                          <p className="font-bold text-white text-xs">
                            {product.name}
                          </p>

                          {product.badge && (
                            <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-800/60 rounded text-[9px] font-mono">
                              {product.badge}
                            </span>
                          )}

                        </div>

                        <p className="text-[11px] text-zinc-400">
                          {product.subtitle}
                        </p>

                        <button
                          onClick={() =>
                            handleOpenPhotoModal(product)
                          }
                          className="text-[10px] text-purple-400 hover:text-purple-300 underline underline-offset-1 mt-0.5 inline-block"
                        >
                          Cambiar Foto
                        </button>

                      </div>

                    </td>

                    {/* SKU */}

                    <td className="py-3 px-4 font-mono text-purple-300">
                      {product.sku}
                    </td>

                    {/* CATEGORY */}

                    <td className="py-3 px-4">

                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono">
                        {product.category}
                      </span>

                    </td>

                    {/* PRICE */}

                    <td className="py-3 px-4">

                      {isEditingP ? (

                        <div className="flex items-center gap-1">

                          <input
                            type="number"
                            value={
                              editingPrice[product.id]
                            }
                            onChange={(e) =>
                              setEditingPrice({
                                ...editingPrice,
                                [product.id]:
                                  Number(
                                    e.target.value
                                  )
                              })
                            }
                            className="w-20 bg-zinc-900 border border-purple-500 rounded px-1.5 py-0.5 text-white font-mono text-xs"
                          />

                          <button
                            onClick={() =>
                              handlePriceSave(
                                product,
                                editingPrice[
                                  product.id
                                ]
                              )
                            }
                            className="p-1 bg-green-600 text-white rounded hover:bg-green-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>

                        </div>

                      ) : (

                        <button
                          onClick={() =>
                            setEditingPrice({
                              ...editingPrice,
                              [product.id]:
                                product.price
                            })
                          }
                          className="font-mono font-bold text-zinc-200 hover:text-purple-400 flex items-center gap-1 group"
                          title="Hacé clic para cambiar precio rápido"
                        >

                          <span>
                            $ {product.price.toLocaleString('es-AR')}
                          </span>

                          <Edit3 className="w-3 h-3 text-zinc-600 group-hover:text-purple-400" />

                        </button>

                      )}

                    </td>

                    {/* STOCK */}

                    <td className="py-3 px-4">

                      <div className="flex flex-wrap gap-1.5 items-center">

                        {product.sizes.map((sz) => {

                          const count =
                            product.stockPerSize[sz] ?? 0;

                          return (

                            <div
                              key={sz}
                              className="flex items-center border border-zinc-800 bg-zinc-900/90 rounded px-1.5 py-0.5 gap-1.5 text-[11px]"
                            >

                              <span className="font-mono font-bold text-purple-300">
                                {sz}:
                              </span>

                              <input
                                type="number"
                                min="0"
                                value={count}
                                onChange={(e) =>
                                  handleStockChange(
                                    product.id,
                                    sz,
                                    parseInt(
                                      e.target.value
                                    ) || 0
                                  )
                                }
                                className="w-10 bg-black/80 border border-zinc-700 focus:border-purple-400 rounded text-center text-white font-mono text-[11px] p-0.5"
                              />

                            </div>

                          );
                        })}

                      </div>

                    </td>

                    {/* TOTAL STOCK */}

                    <td className="py-3 px-4 text-center">

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                          product.totalStock === 0
                            ? 'bg-red-950/80 text-red-400 border border-red-800'
                            : product.totalStock <= 3
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-green-950/80 text-green-300 border border-green-800'
                        }`}
                      >

                        {product.totalStock <= 3 &&
                          product.totalStock > 0 && (
                            <AlertTriangle className="w-3 h-3" />
                          )}

                        {product.totalStock} u.

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="py-3 px-4 text-right">

                      <div className="flex items-center justify-end gap-1">

                        <button
                          onClick={() =>
                            setEditingProduct(product)
                          }
                          className="p-1.5 text-zinc-400 hover:text-purple-300 hover:bg-zinc-900 rounded transition-colors"
                          title="Editar producto completo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          MODAL CAMBIAR FOTO
      ===================================================== */}

      {photoModalProduct && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-md bg-[#120f1a] border border-purple-800/80 rounded-2xl shadow-2xl p-6 space-y-4">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bebas tracking-wide text-white">
                  ACTUALIZAR FOTO REAL
                </h3>

                <p className="text-xs text-zinc-400">
                  {photoModalProduct.name}
                </p>

                <p className="text-[10px] text-zinc-500 mt-1">
                  Seleccioná una foto real desde tu PC o celular.
                </p>

              </div>

              <button
                onClick={() =>
                  setPhotoModalProduct(null)
                }
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <ImageUploadField
              value={photoModalValue}
              onChange={setPhotoModalValue}
              label="Seleccionar nueva foto real"
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">

              <button
                type="button"
                onClick={() => {
                  setPhotoModalProduct(null);
                  setPhotoModalValue('');
                }}
                className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSavePhotoModal}
                disabled={!photoModalValue}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                Guardar Foto
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL AGREGAR PRODUCTO
      ===================================================== */}

      {isAddModalOpen && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-lg bg-[#120f1a] border border-purple-800/60 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-bebas tracking-wide text-white">
                AGREGAR NUEVO PRODUCTO AL CATÁLOGO
              </h3>

              <button
                onClick={() =>
                  setIsAddModalOpen(false)
                }
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleCreateProduct}
              className="space-y-3 text-xs"
            >

              {/* NAME */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Nombre del Producto *
                </label>

                <input
                  type="text"
                  required
                  placeholder="Ej: AIR JORDAN 6 RETRO 'AQUA'"
                  value={newProd.name}
                  onChange={(e) =>
                    setNewProd({
                      ...newProd,
                      name: e.target.value
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />

              </div>

              {/* SUBTITLE + CATEGORY */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Subtítulo / Colorway *
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Ej: Black / Bright Concord"
                    value={newProd.subtitle}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        subtitle: e.target.value
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                  />

                </div>

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Categoría
                  </label>

                  <select
                    value={newProd.category}
                    onChange={(e) => {

                      const cat =
                        e.target.value as ProductCategory;

                      const defaultSizes =
                        cat === 'CALZADO'
                          ? [
                              '40',
                              '41',
                              '42',
                              '43',
                              '44'
                            ]
                          : cat === 'ROPA'
                          ? [
                              'S',
                              'M',
                              'L',
                              'XL'
                            ]
                          : ['ÚNICO'];

                      const stockMap: Record<
                        string,
                        number
                      > = {};

                      defaultSizes.forEach(
                        (s) => {
                          stockMap[s] = 3;
                        }
                      );

                      setNewProd({
                        ...newProd,
                        category: cat,
                        sizes: defaultSizes,
                        stockPerSize: stockMap
                      });

                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                  >

                    <option value="CALZADO">
                      Calzado
                    </option>

                    <option value="ROPA">
                      Ropa
                    </option>

                    <option value="ACCESORIOS">
                      Accesorios
                    </option>

                  </select>

                </div>

              </div>

              {/* PRICE + BADGE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Precio ($ ARS) *
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.price}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        price: Number(
                          e.target.value
                        )
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
                  />

                </div>

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Badge Opcional
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: STOCK REAL / EXCLUSIVO"
                    value={newProd.badge}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        badge: e.target.value
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                  />

                </div>

              </div>

              {/* REAL PHOTO */}

              <ImageUploadField
                value={newProd.image || ''}
                onChange={(val) =>
                  setNewProd({
                    ...newProd,
                    image: val
                  })
                }
                label="Foto Real del Producto (Desde tu PC, Celular o WhatsApp)"
              />

              <p className="text-[10px] text-purple-400">
                * La foto real es obligatoria para publicar el producto.
              </p>

              {/* STOCK */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Stock Inicial por Talle
                </label>

                <div className="grid grid-cols-5 gap-2">

                  {newProd.sizes?.map((sz) => (

                    <div
                      key={sz}
                      className="p-2 bg-zinc-900 rounded border border-zinc-800"
                    >

                      <span className="text-[10px] text-purple-400 block font-bold">
                        Talle {sz}
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          newProd.stockPerSize?.[
                            sz
                          ] || 0
                        }
                        onChange={(e) => {

                          const val =
                            parseInt(
                              e.target.value
                            ) || 0;

                          setNewProd({
                            ...newProd,
                            stockPerSize: {
                              ...newProd.stockPerSize,
                              [sz]: val
                            }
                          });

                        }}
                        className="w-full bg-black border border-zinc-700 rounded text-center text-white font-mono text-xs mt-1"
                      />

                    </div>

                  ))}

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Descripción
                </label>

                <textarea
                  rows={2}
                  placeholder="Detalles de la prenda o calzado..."
                  value={
                    newProd.description || ''
                  }
                  onChange={(e) =>
                    setNewProd({
                      ...newProd,
                      description:
                        e.target.value
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">

                <button
                  type="button"
                  onClick={() =>
                    setIsAddModalOpen(false)
                  }
                  className="px-4 py-2 text-zinc-400 hover:text-white rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!newProd.image}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Publicar Producto
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL EDITAR PRODUCTO
      ===================================================== */}

      {editingProduct && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="relative w-full max-w-lg bg-[#120f1a] border border-purple-800/70 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bebas tracking-wide text-white">
                  EDITAR PRODUCTO: {editingProduct.name}
                </h3>

                <p className="text-xs text-zinc-400">
                  SKU: {editingProduct.sku}
                </p>

              </div>

              <button
                onClick={() =>
                  setEditingProduct(null)
                }
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleSaveEditedProduct}
              className="space-y-3 text-xs"
            >

              {/* NAME */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Nombre
                </label>

                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />

              </div>

              {/* SUBTITLE + PRICE */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Subtítulo / Color
                  </label>

                  <input
                    type="text"
                    required
                    value={editingProduct.subtitle}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        subtitle:
                          e.target.value
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                  />

                </div>

                <div>

                  <label className="block text-zinc-300 font-bold mb-1">
                    Precio ($ ARS)
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(
                          e.target.value
                        )
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white font-mono"
                  />

                </div>

              </div>

              {/* PHOTO */}

              <ImageUploadField
                value={editingProduct.image}
                onChange={(val) =>
                  setEditingProduct({
                    ...editingProduct,
                    image: val
                  })
                }
                label="Foto Real del Producto"
              />

              {/* STOCK */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Stock por Talle
                </label>

                <div className="grid grid-cols-5 gap-2">

                  {editingProduct.sizes.map(
                    (sz) => (

                      <div
                        key={sz}
                        className="p-2 bg-zinc-900 rounded border border-zinc-800"
                      >

                        <span className="text-[10px] text-purple-400 block font-bold">
                          Talle {sz}
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={
                            editingProduct
                              .stockPerSize?.[
                              sz
                            ] || 0
                          }
                          onChange={(e) => {

                            const val =
                              parseInt(
                                e.target.value
                              ) || 0;

                            setEditingProduct({
                              ...editingProduct,

                              stockPerSize: {
                                ...editingProduct.stockPerSize,
                                [sz]: val
                              }

                            });

                          }}
                          className="w-full bg-black border border-zinc-700 rounded text-center text-white font-mono text-xs mt-1"
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-zinc-300 font-bold mb-1">
                  Descripción
                </label>

                <textarea
                  rows={2}
                  value={
                    editingProduct.description
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description:
                        e.target.value
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">

                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct(null)
                  }
                  className="px-4 py-2 text-zinc-400 hover:text-white rounded"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Guardar Cambios
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};