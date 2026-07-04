// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiHeart, FiStar, FiArrowRight } from 'react-icons/fi';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductGrid from '../components/product/ProductGrid';
import CategoryCard from '../components/product/CategoryCard';
import SectionHeading from '../components/common/SectionHeading';
import ZariDivider from '../components/common/ZariDivider';
import Button from '../components/common/Button';

const TESTIMONIALS = [
  {
    name: 'Anita Rao',
    location: 'Mumbai',
    quote: 'The Kanjivaram I bought for my daughter\'s wedding was beyond beautiful. The zari work was even better than what I saw in the photos.',
  },
  {
    name: 'Sneha Kulkarni',
    location: 'Pune',
    quote: 'House of Jaee\'s cotton sarees are my go-to for office wear. Comfortable, elegant, and the colours never fade after washing.',
  },
  {
    name: 'Lakshmi Iyer',
    location: 'Chennai',
    quote: 'Ordered a Banarasi saree for Diwali and it arrived earlier than expected. The packaging itself felt premium.',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [festival, setFestival] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [featuredRes, newRes, bestRes, festRes, catRes] = await Promise.all([
          productService.getAll({ limit: 8 }),
          productService.getAll({ newArrival: true, limit: 4 }),
          productService.getAll({ bestSeller: true, limit: 4 }),
          productService.getAll({ festival: true, limit: 4 }),
          categoryService.getAll(),
        ]);
        setFeatured(featuredRes.data.products);
        setNewArrivals(newRes.data.products);
        setBestSellers(bestRes.data.products);
        setFestival(festRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* ---- Hero Banner ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-beige to-beige-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <span className="text-gold uppercase text-xs md:text-sm tracking-[0.3em] font-semibold">
              Festive Collection 2026
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-maroon mt-4 leading-tight">
              Drape Yourself <br /> in Tradition
            </h1>
            <p className="mt-5 text-brown-light max-w-md font-body text-base md:text-lg">
              Handpicked silk, Banarasi, and Kanjivaram sarees — woven with heritage, styled for today.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/shop">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link to="/new-arrivals">
                <Button variant="outline" size="lg">New Arrivals</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/images/hero/hero-banner.svg"
              alt="Festive saree collection promotional banner"
              className="w-full rounded-sm shadow-xl"
            />
          </div>
        </div>
      </section>

      <ZariDivider />

      {/* ---- Featured Sarees ---- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="Curated For You" title="Featured Sarees" subtitle="A handpicked edit of our most-loved drapes this season." />
        <ProductGrid products={featured} loading={loading} />
        <div className="text-center mt-10">
          <Link to="/shop">
            <Button variant="outline">View All Sarees <FiArrowRight /></Button>
          </Link>
        </div>
      </section>

      {/* ---- Shop by Category ---- */}
      <section className="bg-beige/40 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Explore" title="Shop by Category" subtitle="From everyday cottons to bridal silks, find the perfect saree for every occasion." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.category_id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- New Arrivals ---- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="Just In" title="New Arrivals" subtitle="The latest additions to our saree collection." />
        <ProductGrid products={newArrivals} loading={loading} />
      </section>

      {/* ---- Best Sellers ---- */}
      <section className="bg-beige/40 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="Customer Favourites" title="Best Sellers" subtitle="The sarees our customers can't stop buying." />
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section>

      {/* ---- Festival Collection ---- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="Limited Edition" title="Festival Collection" subtitle="Celebrate every occasion in rich silks and traditional weaves." />
        <ProductGrid products={festival} loading={loading} />
      </section>

      <ZariDivider />

      {/* ---- Why Choose House of Jaee ---- */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="Our Promise" title="Why Choose House of Jaee" />
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: FiHeart, title: 'Handpicked Craftsmanship', desc: 'Every saree is sourced directly from skilled weavers who carry forward generations of tradition.' },
            { icon: FiShield, title: 'Quality You Can Trust', desc: 'Each piece is quality-checked for fabric, finish, and zari work before it reaches you.' },
            { icon: FiTruck, title: 'Doorstep Delivery', desc: 'Carefully packaged and delivered across India, with cash on delivery available.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center px-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-maroon/10 flex items-center justify-center mb-4">
                <Icon size={26} className="text-maroon" />
              </div>
              <h3 className="font-display text-lg text-brown mb-2">{title}</h3>
              <p className="text-sm text-brown-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className="bg-maroon py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="In Their Words" title="Customer Testimonials" />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-cream/95 rounded-sm p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-brown-light italic mb-4">"{t.quote}"</p>
                <p className="text-sm font-semibold text-maroon">{t.name}</p>
                <p className="text-xs text-brown-light">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
