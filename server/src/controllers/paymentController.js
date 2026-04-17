import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  return { keyId, keySecret };
};

const getRazorpayClient = () => {
  const { keyId, keySecret } = getRazorpayConfig();

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_CONFIG_MISSING');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// @desc    Create a Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { keyId } = getRazorpayConfig();
    const razorpay = getRazorpayClient();
    const { plan } = req.body; // 'basic', 'premium', or 'enterprise'
    
    // Define pricing (in INR paise - multiply by 100)
    // E.g., 999 INR = 99900 paise
    const prices = {
      basic: 99900,     // ₹999
      premium: 249900,  // ₹2499
      enterprise: 999900 // ₹9999
    };

    if (!prices[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const options = {
      amount: prices[plan],
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString(36)}_${req.user._id.toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      keyId,
      order,
    });
  } catch (error) {
    if (error.message === 'RAZORPAY_CONFIG_MISSING') {
      console.error('Order Creation Error: Razorpay credentials are missing from server environment.');
      return res.status(500).json({ message: 'Payment gateway is not configured on the server.' });
    }

    const providerError = {
      statusCode: error.statusCode,
      code: error.error?.code,
      description: error.error?.description,
    };

    console.error('Order Creation Error:', providerError);

    if (error.statusCode === 401) {
      return res.status(502).json({
        message: 'Razorpay authentication failed. Check the server Razorpay key ID and key secret.',
      });
    }

    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// @desc    Verify payment and upgrade user
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const userId = req.user._id;
    const { keySecret } = getRazorpayConfig();

    if (!keySecret) {
      return res.status(500).json({ message: 'Payment gateway is not configured on the server.' });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", keySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const user = await User.findById(userId);
      user.subscriptionTier = plan;
      
      user.generationsCount = 0; 
      await user.save();

      return res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully. Tier upgraded!',
        newTier: plan
      });
    } else {
      return res.status(400).json({ message: 'Invalid signature. Payment verification failed.' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};
