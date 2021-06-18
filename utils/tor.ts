//try or :)

export default function (fn: Function, df: any) {
  try {
    return fn();
  } catch (e) {
    return df;
  }
}
