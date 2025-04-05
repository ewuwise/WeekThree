export const stabilityCheck = (volatilityIndex) => {
  if (volatilityIndex >= 70) { // Updated threshold
    alert("Market paused due to high volatility");
  } else if (volatilityIndex < 30) { // Updated threshold
    console.log("Market is stable with low volatility");
  }
};


export const updateVolatility = (newVolatilityIndex) => {
  // Logic to update the volatility index
  console.log(`Updating volatility index to: ${newVolatilityIndex}`);
  notifyVolatilityChange(newVolatilityIndex);
  return newVolatilityIndex;
};

const notifyVolatilityChange = (index) => {
  console.log(`Volatility index updated to: ${index}`);
};
