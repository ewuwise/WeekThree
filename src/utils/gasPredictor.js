export const predictOptimalGasTime = (gasHistory) => {
  if (gasHistory.length < 12 || gasHistory.some(entry => entry.average === undefined)) return null; // Need at least 12 hours of valid data
  
  // Dynamic moving average prediction based on gas history length
  const windowSize = Math.min(6, Math.floor(gasHistory.length / 2)); // Adjust window size

  const predictions = [];
  
  for (let i = windowSize; i < gasHistory.length; i++) {
    if (gasHistory[i].average === undefined) continue; // Skip invalid entries

    const window = gasHistory.slice(i - windowSize, i);
    const avg = window.reduce((sum, entry) => sum + entry.average, 0) / windowSize;
    predictions.push({
      timestamp: new Date(gasHistory[i].timestamp.getTime() + 3600000), // Next hour
      predicted: avg * 0.9 // 10% reduction factor
    });
  }
  
  // Find best time in next 12 hours
  const futurePredictions = predictions.slice(-12);
  const bestTime = futurePredictions.reduce((best, current) => 
    current.predicted < best.predicted ? current : best
  );
  
    if (bestTime.predicted > 100) { // Example threshold for alert
        alert("Gas price is predicted to exceed $100!");
    }
    return {
    bestTime: bestTime.timestamp.toLocaleTimeString(),
    predictedPrice: Math.round(bestTime.predicted),
    confidence: (0.8 - (bestTime.predicted / 100)).toFixed(2) // 0-1 scale
  };
};
