// Testing curves to match:
// Turn 5: Total ~4.5M, Titus hit ~400k
// Turn 20: Total ~27.58M, Titus hit ~1.325M
// Turn 137: Total ~900M

for (const p of [1.6, 1.7, 1.8, 1.9, 2.0]) {
  // Let's test factor = c * (bossTurnCount ** p)
  // At bossTurnCount = 20, factor should be ~602,500
  // c * (20 ** p) = 602500 => c = 602500 / (20 ** p)
  const c = 602500 / Math.pow(20, p);
  
  const factor5 = c * Math.pow(5, p);
  const hit5 = Math.round((60000 + factor5) * 2.0);
  
  const factor20 = c * Math.pow(20, p);
  const hit20 = Math.round((60000 + factor20) * 2.0);
  
  const factor137 = Math.min(c * Math.pow(137, p), 9000000);
  const hit137 = Math.round((60000 + factor137) * 2.0);
  
  console.log(`Power ${p}: hit@5 = ${hit5.toLocaleString()}, hit@20 = ${hit20.toLocaleString()}, hit@137 = ${hit137.toLocaleString()}`);
}
