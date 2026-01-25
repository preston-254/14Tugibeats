# PayPal Integration Setup Guide

This guide will walk you through the steps to enable PayPal payments on your 14 Tugi beat store.

**✅ PayPal is now fully configured and optimized for mobile devices!**

## Current Status
- ✅ PayPal SDK integration complete
- ✅ Mobile-responsive button container
- ✅ Error handling and loading states
- ✅ Automatic SDK loading detection
- ✅ Mobile-optimized button sizing

## Prerequisites
- A PayPal Business account (or Personal account with business features)
- Access to PayPal Developer Dashboard

---

## Step 1: Create a PayPal Developer Account

1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Click **"Log in to Dashboard"** or **"Sign Up"** if you don't have an account
3. Log in with your PayPal account credentials
4. If you don't have a PayPal account, create one first at [https://www.paypal.com](https://www.paypal.com)

---

## Step 2: Create a PayPal App

1. Once logged into the PayPal Developer Dashboard, click on **"My Apps & Credentials"** in the left sidebar
2. You'll see two sections:
   - **Sandbox** (for testing)
   - **Live** (for production)
3. For initial setup, start with **Sandbox** to test without real money

### For Sandbox (Testing):
1. Click on the **"Sandbox"** tab
2. Click **"Create App"** button
3. Fill in the app details:
   - **App Name**: e.g., "14 Tugi Beat Store"
   - **Merchant**: Select your sandbox business account (or create one)
4. Click **"Create App"**
5. You'll see your **Client ID** and **Secret** - **copy the Client ID** (you'll need it)

### For Live (Production):
1. Click on the **"Live"** tab
2. Click **"Create App"** button
3. Fill in the app details:
   - **App Name**: e.g., "14 Tugi Beat Store - Live"
   - **Merchant**: Select your business account
4. Click **"Create App"**
5. **Copy the Client ID** for production use

---

## Step 3: Configure Client ID in Your Code

1. Open the file `checkout.html` in your code editor
2. Find the script section near the bottom (around line 203-210) that looks like this:

```javascript
<script>
    // PayPal Client ID - Replace with your actual Client ID from PayPal Developer Dashboard
    // Get your Client ID at: https://developer.paypal.com/dashboard/applications/sandbox
    const PAYPAL_CLIENT_ID = 'YOUR_CLIENT_ID';
    
    // Load PayPal SDK dynamically
    if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'YOUR_CLIENT_ID') {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
        script.async = true;
        document.head.appendChild(script);
    }
</script>
```

3. Replace `'YOUR_CLIENT_ID'` with your actual PayPal Client ID from Step 2

**Example:**
```javascript
const PAYPAL_CLIENT_ID = 'AeA1QIZXiflr1_-d-1PNqH4X5b5e3iK6fG9lKqK4qK4qK4qK4qK4qK4';
```

---

## Step 4: Test the Integration (Sandbox Mode)

1. **Create Test Accounts** (if using Sandbox):
   - In PayPal Developer Dashboard, go to **"Accounts"** under Sandbox
   - Create a test buyer account and a test business account
   - Use these accounts to test payments

2. **Test the Payment Flow**:
   - Add items to your cart on the website
   - Go to checkout
   - Select PayPal as payment method
   - Click the PayPal button
   - You should be redirected to PayPal's sandbox environment
   - Log in with your test buyer account
   - Complete the payment
   - You should be redirected back to your site with a success message

---

## Step 5: Switch to Live Mode (Production)

Once testing is complete:

1. **Get Your Live Client ID**:
   - Go back to PayPal Developer Dashboard
   - Switch to the **"Live"** tab
   - Copy your Live Client ID (different from Sandbox)

2. **Update Your Code**:
   - Replace the Client ID in `checkout.html` with your Live Client ID
   - Make sure you're using the Live Client ID, not the Sandbox one

3. **Verify Your Business Account**:
   - Ensure your PayPal business account is fully verified
   - Complete any required business verification steps

---

## Step 6: Additional Configuration (Optional)

### Customize PayPal Button Style

You can customize the PayPal button appearance in `checkout.js`. Find the `paypal.Buttons()` configuration (around line 220):

```javascript
paypal.Buttons({
    style: {
        layout: 'vertical',  // Options: 'vertical' or 'horizontal'
        color: 'blue',      // Options: 'gold', 'blue', 'silver', 'white', 'black'
        shape: 'rect',      // Options: 'rect' or 'pill'
        label: 'paypal'     // Options: 'paypal', 'checkout', 'buynow', 'pay', 'installment'
    },
    // ... rest of configuration
})
```

### Supported Currencies

Currently set to USD. To change:
- Update the currency in the PayPal SDK script URL in `checkout.html`
- Update currency codes in `checkout.js` where orders are created

---

## Troubleshooting

### PayPal Button Not Showing
- **Check**: Make sure you've replaced `'YOUR_CLIENT_ID'` with your actual Client ID
- **Check**: Verify the Client ID is correct (no extra spaces or quotes)
- **Check**: Open browser console (F12) for any error messages

### Payment Not Processing
- **Check**: Ensure you're using the correct environment (Sandbox vs Live)
- **Check**: Verify your PayPal account is active and verified
- **Check**: Check browser console for JavaScript errors

### Redirect Issues
- **Check**: Ensure your website URL is added to PayPal app settings (if required)
- **Check**: Verify return URLs are properly configured

### Common Errors
- **"Invalid Client ID"**: Double-check you copied the correct Client ID
- **"App not found"**: Make sure the app exists in your PayPal Developer Dashboard
- **"Currency not supported"**: Verify the currency code matches your PayPal account settings

---

## Security Best Practices

1. **Never commit Client IDs to public repositories**
   - Consider using environment variables or a config file that's git-ignored
   - For production, use server-side configuration

2. **Use HTTPS**
   - PayPal requires HTTPS for live payments
   - Ensure your website uses SSL certificates

3. **Validate Payments Server-Side**
   - The current implementation is client-side only
   - For production, implement server-side payment verification
   - Use PayPal webhooks to verify payment completion

4. **Keep Client Secret Secure**
   - Never expose your Client Secret in client-side code
   - Use it only in server-side API calls

---

## Support Resources

- **PayPal Developer Documentation**: [https://developer.paypal.com/docs](https://developer.paypal.com/docs)
- **PayPal JavaScript SDK Reference**: [https://developer.paypal.com/sdk/js/reference](https://developer.paypal.com/sdk/js/reference)
- **PayPal Support**: [https://www.paypal.com/support](https://www.paypal.com/support)

---

## Quick Reference

**File to Edit**: `checkout.html`  
**Line to Find**: Look for `const PAYPAL_CLIENT_ID = 'YOUR_CLIENT_ID';`  
**What to Replace**: `'YOUR_CLIENT_ID'` with your actual Client ID  
**Where to Get Client ID**: [https://developer.paypal.com/dashboard/applications](https://developer.paypal.com/dashboard/applications)

---

**Note**: This integration uses PayPal's client-side SDK. For production use, consider implementing server-side payment verification for enhanced security.


