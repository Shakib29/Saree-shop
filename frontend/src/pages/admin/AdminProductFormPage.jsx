// src/pages/admin/AdminProductFormPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { FullPageSpinner } from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const emptyForm = {
  categoryId: '', name: '', description: '', fabric: '', colour: '', occasion: '',
  careInstructions: '', price: '', discountPrice: '', stockQuantity: '',
  isNewArrival: false, isBestSeller: false, isFestivalCollection: false, isActive: true,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoryService.getAllAdmin().then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productService.getByIdAdmin(id).then((res) => {
      const p = res.data.product;
      setForm({
        categoryId: p.category_id,
        name: p.name,
        description: p.description || '',
        fabric: p.fabric || '',
        colour: p.colour || '',
        occasion: p.occasion || '',
        careInstructions: p.care_instructions || '',
        price: p.price,
        discountPrice: p.discount_price || '',
        stockQuantity: p.stock_quantity,
        isNewArrival: !!p.is_new_arrival,
        isBestSeller: !!p.is_best_seller,
        isFestivalCollection: !!p.is_festival_collection,
        isActive: !!p.is_active,
      });
      setImages(p.images || []);
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    if (isEdit) {
      try {
        const res = await productService.addImage(id, { imageUrl: newImageUrl.trim(), isPrimary: images.length === 0 });
        setImages((imgs) => [...imgs, { image_id: res.data.imageId, image_url: newImageUrl.trim(), is_primary: images.length === 0 }]);
        setNewImageUrl('');
      } catch (err) {
        showToast(err.message, 'error');
      }
    } else {
      setImages((imgs) => [...imgs, { image_url: newImageUrl.trim(), is_primary: imgs.length === 0 }]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = async (img, idx) => {
    if (isEdit && img.image_id) {
      try {
        await productService.removeImage(img.image_id);
      } catch (err) {
        showToast(err.message, 'error');
        return;
      }
    }
    setImages((imgs) => imgs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stockQuantity: Number(form.stockQuantity),
    };
    try {
      if (isEdit) {
        await productService.update(id, payload);
        showToast('Product updated.', 'success');
      } else {
        await productService.create({ ...payload, images: images.map((i) => i.image_url) });
        showToast('Product created.', 'success');
      }
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-maroon mb-5 hover:underline">
        <FiArrowLeft size={14} /> Back to Products
      </Link>

      <h1 className="font-display text-2xl text-brown mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-beige-dark rounded-sm p-6 flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Product Name</label>
            <input required value={form.name} onChange={handleChange('name')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Category</label>
            <select required value={form.categoryId} onChange={handleChange('categoryId')} className="input-field">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={handleChange('description')} className="input-field resize-none" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Fabric</label>
            <input value={form.fabric} onChange={handleChange('fabric')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Colour</label>
            <input value={form.colour} onChange={handleChange('colour')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Occasion</label>
            <input value={form.occasion} onChange={handleChange('occasion')} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brown mb-1.5">Care Instructions</label>
          <input value={form.careInstructions} onChange={handleChange('careInstructions')} className="input-field" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Price (₹)</label>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Discount Price (₹)</label>
            <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={handleChange('discountPrice')} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Stock Quantity</label>
            <input required type="number" min="0" value={form.stockQuantity} onChange={handleChange('stockQuantity')} className="input-field" />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-brown mb-1.5">Product Images</label>
          <div className="flex gap-2 mb-3">
            <input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="/images/products/example.svg or full URL"
              className="input-field"
            />
            <Button type="button" variant="outline" onClick={handleAddImage}><FiPlus /></Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-24 rounded-sm overflow-hidden border border-beige-dark">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img, idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                  aria-label="Remove image"
                >
                  <FiTrash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isNewArrival} onChange={handleChange('isNewArrival')} className="accent-maroon" /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isBestSeller} onChange={handleChange('isBestSeller')} className="accent-maroon" /> Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isFestivalCollection} onChange={handleChange('isFestivalCollection')} className="accent-maroon" /> Festival Collection
          </label>
          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={form.isActive} onChange={handleChange('isActive')} className="accent-maroon" /> Active
          </label>
        </div>

        <Button type="submit" size="lg" className="mt-2 self-start" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </div>
  );
}
