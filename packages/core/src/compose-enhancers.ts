export type Enhancer<T> = (value: T) => T;

export function composeEnhancers<T>(enhancers: Enhancer<T>[]): Enhancer<T> {
  return currentValue =>
    enhancers.reduce(
      (enhancedValue, enhancer) => enhancer(enhancedValue),
      currentValue
    );
}
