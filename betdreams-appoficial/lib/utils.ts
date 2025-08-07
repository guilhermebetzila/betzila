export function embaralharArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function gerarNumerosUnicos(quantidade: number, min: number, max: number): number[] {
  const numeros = new Set<number>();
  while (numeros.size < quantidade) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numeros.add(num);
  }
  return Array.from(numeros);
}
