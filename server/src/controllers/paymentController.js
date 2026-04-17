import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
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
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
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

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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