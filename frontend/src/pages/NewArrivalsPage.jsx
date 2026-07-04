// src/pages/NewArrivalsPage.jsx
import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import SectionHeading from '../components/common/SectionHeading';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll({ newArrival: true, limit: 24 })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <SectionHeading eyebrow="Fresh In" title="New Arrivals" subtitle="The newest sarees to join the House of Jaee family." />
      <ProductGrid products={products} loading={loading} emptyMessage="No new arrivals at the moment. Check back soon!" />
    </div>
  );
}
