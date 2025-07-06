// Utility functions for fraction exercises

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

export function simplify(num: number, den: number) {
  const divisor = gcd(num, den)
  return { num: num / divisor, den: den / divisor }
}

export function generateRandomFraction(minDen = 2, maxDen = 12) {
  const denominator = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1
  return { numerator, denominator }
}

export function generateTwoFractions(minDen = 2, maxDen = 12) {
  const f1 = generateRandomFraction(minDen, maxDen)
  const f2 = generateRandomFraction(minDen, maxDen)
  return { num1: f1.numerator, den1: f1.denominator, num2: f2.numerator, den2: f2.denominator }
}
