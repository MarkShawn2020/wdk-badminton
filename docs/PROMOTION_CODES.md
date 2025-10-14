# Stripe Promotion Codes Guide

## Overview

ReelVan supports Stripe promotion codes for offering discounts to users.

**Important Strategy**: Users receive **FULL credits** even when using a promotion code. The discount only applies to the payment amount. This is a true promotional offer.

Example:

- User buys 110 credits (normally $9.99)
- Uses "Reelvan9" code (90% off)
- Pays only $0.99
- Still receives **full 110 credits**

## Quick Start

### 1. Create Promotion Codes in Stripe

Run the creation script:

```bash
pnpm tsx --env-file=.env.local scripts/create-stripe-coupon.ts
```

This will create:

| Code        | Discount | Duration | Description          |
| ----------- | -------- | -------- | -------------------- |
| `Reelvan9`  | 90% off  | Forever  | Launch promotion     |
| `WELCOME50` | 50% off  | Once     | First purchase only  |
| `BIGLAUNCH` | $100 off | Once     | High-value customers |

### 2. Users Apply Codes at Checkout

Codes are automatically available in the Stripe Checkout page. Users can:

1. Click "Add promotion code" link
2. Enter code (e.g., "Reelvan9")
3. See discount applied immediately
4. Complete payment with discounted price

### 3. System Handles Credits

Backend automatically:

- ✅ Grants full credits to user
- ✅ Records promotion info in transaction metadata
- ✅ Tracks discount amount for analytics

## Managing Promotion Codes

### View Existing Codes

The script lists all current promotion codes:

```bash
pnpm tsx --env-file=.env.local scripts/create-stripe-coupon.ts
```

Or check Stripe Dashboard:

- Test: https://dashboard.stripe.com/test/coupons
- Live: https://dashboard.stripe.com/coupons

### Create New Codes

Edit `scripts/create-stripe-coupon.ts`:

```typescript
const COUPONS = [
  {
    id: 'MYCODE',
    name: 'My Custom Discount',
    percent_off: 75, // 75% off
    duration: 'forever',
    max_redemptions: 50,
    metadata: {
      campaign: 'custom',
      description: 'My description',
    },
  },
]

const PROMOTION_CODES = [
  {
    coupon_id: 'MYCODE',
    code: 'SAVE75', // User-facing code
    active: true,
    max_redemptions: 50,
  },
]
```

Then run the script again.

### Deactivate a Code

Via Stripe Dashboard or API:

```typescript
// In your code
await stripe.promotionCodes.update('promo_xxxxx', {
  active: false,
})
```

## Promotion Code Options

### Discount Types

**Percentage Off:**

```typescript
{
  percent_off: 90,  // 90% off
}
```

**Fixed Amount Off:**

```typescript
{
  amount_off: 5000,  // $50 off (in cents)
  currency: 'usd',
}
```

### Duration Options

**Forever** - Applies to all charges:

```typescript
{
  duration: 'forever'
}
```

**Once** - Applies to first payment only (good for subscriptions):

```typescript
{
  duration: 'once'
}
```

**Repeating** - Applies for X months:

```typescript
{
  duration: 'repeating',
  duration_in_months: 3,  // First 3 months
}
```

### Redemption Limits

**Per code:**

```typescript
{
  max_redemptions: 100,  // Only 100 uses total
}
```

**Per customer:**

```typescript
{
  restrictions: {
    first_time_transaction: true,  // Only for new customers
  },
}
```

## Analytics & Tracking

### View Promotion Usage

Check transaction metadata in database:

```sql
SELECT
  user_id,
  amount,
  created_at,
  metadata->'promotion'->>'discount_percent' as discount,
  metadata->'promotion'->>'paid_amount' as paid
FROM credit_transactions
WHERE stripe_session_id IS NOT NULL
  AND metadata->'promotion' IS NOT NULL
ORDER BY created_at DESC;
```

### Stripe Dashboard

View redemption stats:

1. Go to [Coupons](https://dashboard.stripe.com/coupons)
2. Click on a coupon
3. See "Times redeemed" and other stats

## Common Use Cases

### 1. Launch Promotion (90% off)

```typescript
{
  id: 'LAUNCH90',
  percent_off: 90,
  duration: 'forever',
  max_redemptions: 500,  // First 500 users
}
```

### 2. Referral Discount (50% off first purchase)

```typescript
{
  id: 'REFER50',
  percent_off: 50,
  duration: 'once',  // Only first purchase
}
```

### 3. VIP Discount ($100 off)

```typescript
{
  id: 'VIP100',
  amount_off: 10000,  // $100 in cents
  currency: 'usd',
  duration: 'once',
  // Manually give code to VIP users
}
```

### 4. Holiday Sale (Time-limited)

```typescript
{
  id: 'HOLIDAY2025',
  percent_off: 40,
  duration: 'forever',
  redeem_by: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),  // 7 days
}
```

## Testing

### Test Mode

1. Use Stripe test keys in `.env.local`:

   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

2. Create test promotion codes:

   ```bash
   pnpm tsx --env-file=.env.local scripts/create-stripe-coupon.ts
   ```

3. Test checkout with code:
   - Go to http://localhost:3000/pricing
   - Click "Buy Credits"
   - Enter test code at checkout
   - Use test card: `4242 4242 4242 4242`

4. Verify in logs:
   - Check webhook logs for promotion info
   - Check database for transaction with metadata

### Production

1. Switch to live keys in production environment

2. Create live promotion codes:
   - Update `.env` with live keys
   - Run script in production
   - Or manually create in Stripe Dashboard

3. Monitor usage:
   - Track redemptions in Stripe Dashboard
   - Monitor revenue impact
   - Check transaction metadata

## Troubleshooting

### Code Not Applying

**Check:**

- Code is active: `stripe.promotionCodes.retrieve('promo_xxx')`
- Not exceeded max_redemptions
- Not expired (redeem_by date)
- Coupon is valid

### Credits Not Added

**Check webhook:**

```bash
# View recent webhook events
stripe events list --limit 10
```

**Check logs:**

- Look for "Credits added successfully" message
- Check for "promotion_applied: true"

### Wrong Credit Amount

**This shouldn't happen!** User always gets full credits.

If it does:

1. Check webhook code (line ~113)
2. Verify `p_amount: parseInt(credits)` uses original credits
3. Check transaction metadata

## Best Practices

1. **Name codes clearly**: Use descriptive codes like "WELCOME50" not "XYZ123"

2. **Set limits**: Always set `max_redemptions` to prevent abuse

3. **Track campaigns**: Use metadata to track which campaign each code belongs to

4. **Time-limit codes**: Use `redeem_by` for seasonal promotions

5. **Test first**: Always test in test mode before going live

6. **Monitor usage**: Regularly check redemption counts

7. **Communicate clearly**: Tell users they get full credits even with discount

## FAQs

### Can users stack multiple codes?

No, Stripe allows only one promotion code per checkout.

### Do subscription discounts affect all payments?

Depends on `duration`:

- `once`: Only first payment
- `forever`: All payments (use cautiously!)
- `repeating`: First X months

### Can I change a code after creation?

You can:

- Activate/deactivate
- Update max_redemptions

You cannot:

- Change discount amount (create new code instead)
- Change coupon ID

### How do I revoke a code?

```typescript
await stripe.promotionCodes.update('promo_xxx', {
  active: false,
})
```

### Can I see who used a code?

Yes, in webhook metadata:

```javascript
metadata: {
  promotion: {
    discount_percent: 90,
    paid_amount: 999,  // $9.99
    original_amount: 9999,  // $99.99
  }
}
```

Also check Stripe Dashboard → Coupons → [Code] → "Customers"

## Support

For issues:

1. Check Stripe Dashboard → Developers → Logs
2. Check application logs for webhook events
3. Query `credit_transactions` table for metadata
4. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

**Last Updated**: 2025-10-13
