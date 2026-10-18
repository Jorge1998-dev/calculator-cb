// Let's test a curve that matches the 4 real data points:
// Turn 5: 4.5M
// Turn 20: 27.58M (Titus hit: 1.325M)
// Turn 40: 67.99M
// Turn 46: 93.04M (Titus hit: 7.677M)

// Notice between 40 and 46, Titus hit jumps from ~3.5M to 7.677M!
// Why does it jump? Because Wixwell's shield growth is +25% compounding!
// In compounding growth, each A2 of Wixwell increases shield by 1.25x.
// 1.25^N means growth is slow at first, then explodes!

function getTitusHit(round) {
  // Base hit before shield: 60k * 2.0 = 120k
  // Shield contribution:
  // At round 20: factor * 2.0 = 1.325M - 120k = 1.205M => factor = 602.5k
  // At round 46: factor * 2.0 = 7.677M - 120k = 7.557M => factor = 3.778M
  // Ratio 46 vs 20: 3778k / 602.5k = 6.27x
  // (46/20)^p = 6.27 => 2.3^p = 6.27 => p * ln(2.3) = ln(6.27) => p * 0.833 = 1.835 => p = 2.2!
  // Power p = 2.2 or compounding 1.08^round!
  const p = 2.2;
  const c = 602500 / Math.pow(20, p);
  const factor = Math.min(c * Math.pow(round, p), 8500000);
  return Math.round((60000 + factor) * 2.0);
}

console.log('Turn 5 hit:', getTitusHit(5).toLocaleString());
console.log('Turn 20 hit:', getTitusHit(20).toLocaleString());
console.log('Turn 40 hit:', getTitusHit(40).toLocaleString());
console.log('Turn 46 hit:', getTitusHit(46).toLocaleString());
console.log('Turn 100 hit:', getTitusHit(100).toLocaleString());
console.log('Turn 137 hit:', getTitusHit(137).toLocaleString());
