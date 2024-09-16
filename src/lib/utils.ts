export function formatAmountToCurrencyString(amount: bigint): string {
  const usd = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const convertedAmount = Number(amount) / 100;
  return usd.format(convertedAmount);
}
