export const updateBadgeLevel = (userBurns) => {
  let badgeLevel = "Copper"; // Default badge level

  if (userBurns >= 1000000) {
    badgeLevel = "Platinum";
  } else if (userBurns >= 200000) {
    badgeLevel = "Gold";
  } else if (userBurns >= 50000) {
    badgeLevel = "Silver";
  }

  console.log(`User badge level updated to: ${badgeLevel}`);
  return badgeLevel;
};

export const evolveBadge = (user) => {
  // Logic to evolve the user's badge based on total burns and participation
  const userBurns = getUserBurns(user);
  return updateBadgeLevel(userBurns);
};

const getUserBurns = (user) => {
  // Placeholder for fetching user's total burns from a database or blockchain
  return 0; // Example value
};
