// src/pages/ShopPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import Button from '../components/common/Button';

const SORT_OPTIONS = [
  { value: 'created_at-DESC', label: 'Newest First' },
  { value: 'price-ASC', label: 'Price: Low to High' },
  { value: 'price-DESC', label: 'Price: High to Low' },
  { value: 'rating-DESC', label: 'Top Rated' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || 'created_at-DESC';
  const activePage = Number(searchParams.get('page') || 1);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const [sortBy, sortOrder] = activeSort.split('-');
    try {
      const res = await productService.getAll({
        category: activeCategory || undefined,
        search: activeSearch || undefined,
        sortBy,
        sortOrder,
        page: activePage,
        limit: 12,
      });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSearch, activeSort, activePage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page'); // reset pagination on filter change
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-maroon">
          {activeSearch ? `Search results for "${activeSearch}"` : 'Shop All Sarees'}
        </h1>
        <p className="text-brown-light text-sm mt-2">{pagination.total} saree(s) found</p>
      </div>

      <button
        onClick={() => setMobileFiltersOpen((s) => !s)}
        className="lg:hidden flex items-center gap-2 text-sm text-maroon border border-maroon px-4 py-2 rounded-sm mb-4"
      >
        <FiFilter size={16} /> Filters
      </button>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar filters */}
        <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white border border-beige-dark rounded-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-display text-lg text-brown">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><FiX size={18} /></button>
            </div>

            <h3 className="font-display text-base text-brown mb-3">Category</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`text-sm ${!activeCategory ? 'text-maroon font-semibold' : 'text-brown-light hover:text-maroon'}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.category_id}>
                  <button
                    onClick={() => updateParam('category', cat.slug)}
                    className={`text-sm ${activeCategory === cat.slug ? 'text-maroon font-semibold' : 'text-brown-light hover:text-maroon'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>

            {(activeCategory || activeSearch) && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setSearchParams({})}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="flex justify-end mb-5">
            <select
              value={activeSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-beige-dark rounded-sm px-3 py-2 text-sm bg-white outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <ProductGrid products={products} loading={loading} emptyMessage="No sarees match your filters. Try adjusting your search." />

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={`w-9 h-9 rounded-sm text-sm border ${
                    activePage === i + 1
                      ? 'bg-maroon text-cream border-maroon'
                      : 'border-beige-dark text-brown hover:bg-beige'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
