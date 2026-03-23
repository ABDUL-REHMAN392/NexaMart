export const DELIVERY_TIERS = [
  { maxKg: 0.5, fee: 2.99, label: "Light (up to 0.5 kg)" },
  { maxKg: 2, fee: 5.99, label: "Standard (0.5 – 2 kg)" },
  { maxKg: 5, fee: 9.99, label: "Heavy (2 – 5 kg)" },
  { maxKg: Infinity, fee: 14.99, label: "Bulky (5+ kg)" },
];

export const FREE_DELIVERY_ABOVE_KG = null; // ya koi value set karo e.g. 10

/**
 * Cart ke total weight se delivery fee calculate karo
 * @param {number} totalWeightKg
 * @returns {number} fee in USD
 */
export function calcDeliveryFee(totalWeightKg) {
  if (FREE_DELIVERY_ABOVE_KG && totalWeightKg >= FREE_DELIVERY_ABOVE_KG)
    return 0;
  const tier = DELIVERY_TIERS.find((t) => totalWeightKg <= t.maxKg);
  return tier ? tier.fee : DELIVERY_TIERS[DELIVERY_TIERS.length - 1].fee;
}

/**
 * Cart items se total weight calculate karo
 * @param {Array} items  — har item mein weight (kg) field hona chahiye
 * @returns {number} totalWeightKg
 */
export function calcCartWeight(items) {
  return items.reduce(
    (sum, item) => sum + (item.weight || 0) * item.quantity,
    0,
  );
}
