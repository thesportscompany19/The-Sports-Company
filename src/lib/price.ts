export function normalizeFee(fee: string): { sessionLabel: string; amount: number } {
  const label = fee.toLowerCase().includes("month") ? "Monthly" : "Per Session";
  const match = fee.replace(/,/g, "").match(/(\d+)/);
  const amount = match ? Number(match[0]) : 0;
  return { sessionLabel: label, amount };
}

export function formatRupee(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}
