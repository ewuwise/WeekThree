export const calculateTieredReward = (amount) => {
  const tiers = [
    { threshold: 100,  multiplier: 1.0 },  // Tier 1: 1x
    { threshold: 1000, multiplier: 1.2 },  // Tier 2: 20% bonus
    { threshold: 5000, multiplier: 1.5 },  // Tier 3: 50% bonus
    { threshold: 10000, multiplier: 2.0 }  // Tier 4: 2x
  ];

  // Find the highest tier the amount qualifies for
  const applicableTier = [...tiers].reverse().find(
    tier => amount >= tier.threshold
  ) || tiers[0];

  return {
    baseReward: amount * 0.1, // 10% base reward
    bonus: (amount * 0.1) * (applicableTier.multiplier - 1),
    tier: tiers.indexOf(applicableTier) + 1,
    multiplier: applicableTier.multiplier
  };
};
