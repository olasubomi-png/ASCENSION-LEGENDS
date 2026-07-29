export interface ISeededRandom {
  next(): number;
  int(min: number, max: number): number;
  percent(): number;
}
