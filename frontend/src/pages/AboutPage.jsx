// src/pages/AboutPage.jsx
import { FiHeart, FiTarget, FiEye, FiAward, FiUsers } from 'react-icons/fi';
import ZariDivider from '../components/common/ZariDivider';
import SectionHeading from '../components/common/SectionHeading';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="grid md:grid-cols-2 items-center">
        <div className="px-6 md:px-16 py-16 md:py-24">
          <span className="text-gold uppercase text-xs tracking-[0.3em] font-semibold">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl text-maroon mt-4 leading-tight">
            Woven With Heritage, <br /> Styled For Today
          </h1>
          <p className="mt-6 text-brown-light leading-relaxed">
            House of Jaee began as a small family endeavour to bring the timeless beauty of Indian
            handloom sarees to women everywhere — without losing the artistry of the weavers who make
            them. What started as a modest collection of cotton and silk sarees from a handful of
            looms has grown into a curated home for some of India's finest weaves, from Banarasi
            brocades to Kanjivaram silks.
          </p>
          <p className="mt-4 text-brown-light leading-relaxed">
            Every saree we sell carries a story — of the hands that wove it, the region it comes from,
            and the occasion it's meant to celebrate. We believe a saree is never "just clothing."
            It's a thread connecting generations.
          </p>
        </div>
        <div className="h-full">
          <img src="/images/hero/about-craft.svg" alt="Illustration representing handloom craftsmanship" className="w-full h-full object-cover" />
        </div>
      </section>

      <ZariDivider />

      {/* Mission / Vision / Quality / Craftsmanship */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionHeading eyebrow="What We Stand For" title="Our Values" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FiTarget, title: 'Our Mission', desc: 'To make authentic, high-quality handloom sarees accessible to every woman, while ensuring fair value reaches the weavers behind them.' },
            { icon: FiEye, title: 'Our Vision', desc: 'To become India\'s most trusted name in ethnic wear — known equally for craftsmanship, transparency, and customer care.' },
            { icon: FiAward, title: 'Commitment to Quality', desc: 'Every saree passes through multiple quality checks for fabric integrity, dye fastness, and finishing before it reaches your doorstep.' },
            { icon: FiUsers, title: 'Handmade Craftsmanship', desc: 'We work directly with weaver collectives across India, supporting traditional techniques passed down through generations.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-beige-dark rounded-sm p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-maroon/10 flex items-center justify-center mb-4">
                <Icon size={22} className="text-maroon" />
              </div>
              <h3 className="font-display text-lg text-brown mb-2">{title}</h3>
              <p className="text-sm text-brown-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing statement */}
      <section className="bg-maroon py-16 text-center">
        <FiHeart size={32} className="text-gold mx-auto mb-4" />
        <h2 className="font-display text-2xl md:text-3xl text-cream max-w-2xl mx-auto px-4">
          "A saree is six yards of identity, tradition, and grace — and we're honoured to be part of yours."
        </h2>
      </section>
    </div>
  );
}
