// src/pages/OrderConfirmationPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate, ORDER_STATUS_COLORS } from '../utils/format';
import { FullPageSpinner } from '../components/common/Spinner';
import Button from '../components/common/Button';
import ZariDivider from '../components/common/ZariDivider';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    orderService.track(orderNumber)
      .then((res) => setOrder(res.data.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <FullPageSpinner />;

  if (notFound || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-maroon mb-2">Order not found</h1>
        <p className="text-brown-light mb-6">We couldn't find an order with this number.</p>
        <Link to="/"><Button>Go to Homepage</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-10">
        <FiCheckCircle size={56} className="text-green-600 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-maroon mb-2">Thank You for Your Order!</h1>
        <p className="text-brown-light">A confirmation has been recorded for order <span className="font-semibold text-brown">{order.order_number}</span></p>
      </div>

      <ZariDivider className="mb-10" />

      <div className="bg-white border border-beige-dark rounded-sm p-6 mb-6">
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase text-brown-light">Order Number</p>
            <p className="font-semibold text-brown">{order.order_number}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-brown-light">Order Status</p>
            <span className={`inline-block text-xs px-2.5 py-1 rounded-sm font-medium mt-1 ${ORDER_STATUS_COLORS[order.order_status]}`}>
              {order.order_status}
            </span>
          </div>
          <div>
            <p className="text-xs uppercase text-brown-light">Estimated Delivery</p>
            <p className="font-semibold text-brown flex items-center gap-1.5"><FiTruck size={14} /> {formatDate(order.estimated_delivery_date)}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-beige-dark pt-6">
          <div>
            <h3 className="font-display text-base text-brown mb-2">Delivery Address</h3>
            <p className="text-sm text-brown-light">{order.customer_name}</p>
            <p className="text-sm text-brown-light">{order.address_line}</p>
            <p className="text-sm text-brown-light">{order.city}, {order.state} - {order.pin_code}</p>
            <p className="text-sm text-brown-light mt-1">{order.mobile_number}</p>
          </div>
          <div>
            <h3 className="font-display text-base text-brown mb-2">Payment Method</h3>
            <p className="text-sm text-brown-light">{order.payment?.payment_method}</p>
            <p className="text-sm text-brown-light">
              Status: <span className="font-medium text-brown">{order.payment?.payment_status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-beige-dark rounded-sm p-6 mb-8">
        <h3 className="font-display text-lg text-brown mb-4 flex items-center gap-2"><FiPackage /> Ordered Products</h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.order_item_id} className="flex justify-between text-sm border-b border-beige-dark/60 pb-3">
              <span className="text-brown-light">{item.product_name} × {item.quantity}</span>
              <span className="text-brown font-medium">{formatPrice(item.line_total)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm">
          <div className="flex justify-between text-brown-light"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-brown-light"><span>Delivery</span><span>{Number(order.delivery_charge) === 0 ? 'FREE' : formatPrice(order.delivery_charge)}</span></div>
          <div className="flex justify-between font-semibold text-brown text-base border-t border-beige-dark pt-2"><span>Total</span><span>{formatPrice(order.total_amount)}</span></div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/shop"><Button size="lg">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
