// src/pages/BestSellersPage.jsx
import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/common/SectionHeading';

export default function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll({ bestSeller: true, limit: 24 })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <SectionHeading eyebrow="Most Loved" title="Best Sellers" subtitle="The sarees our customers keep coming back for." />
      <ProductGrid products={products} loading={loading} emptyMessage="No best sellers yet — check back soon!" />
    </div>
  );
}
