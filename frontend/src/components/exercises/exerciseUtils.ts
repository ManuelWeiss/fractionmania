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

// Parses a line like "a / b" or "a b / c" into { numerator, denominator or whole, num, den }
export function parseSimplificationLine(line: string) {
  const parts = line.trim().split(' ')
  let whole = 0, num = 0, den = 1
  if (parts.length === 2) {
    whole = parseInt(parts[0], 10)
    ;[num, den] = parts[1].split('/').map(Number)
  } else {
    [num, den] = parts[0].split('/').map(Number)
  }
  // Convert to improper fraction for easier comparison/simplification
  const improperNum = Math.abs(whole) * den + num
  return {
    numerator: whole < 0 ? -improperNum : improperNum,
    denominator: den,
    whole,
    num,
    den,
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}