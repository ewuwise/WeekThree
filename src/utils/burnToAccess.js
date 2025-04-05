export const burnToAccess = (protocol, amount) => {
  const accessRequirements = {
    Aave: { burnAmount: 500, benefit: "+0.5% APY on deposits" },
    Uniswap: { burnAmount: 1000, benefit: "Custom pool hooks" },
    Curve: { burnAmount: 2500, benefit: "Vote-escrow multiplier" },
  };

  if (accessRequirements[protocol]) {
    const { burnAmount, benefit } = accessRequirements[protocol];
    if (amount >= burnAmount) {
      console.log(`Access granted to ${protocol}: ${benefit}`);
      return true;
    } else {
      console.log(`Insufficient burn amount for ${protocol}. Required: ${burnAmount} BMT`);
      return false;
    }
  } else {
    console.log("Protocol not recognized.");
    return false;
  }
};
