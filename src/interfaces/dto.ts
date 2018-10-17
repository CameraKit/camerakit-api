export default interface Dto<T> {
  out?: T;
  message: string;
  error?: string;
}