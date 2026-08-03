import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//basically this function is used to format the currency in INR format. It takes a number as input and returns a string in the format of ₹1,00,000.00
export function formatStatementMonth(month: string | null) {
  if (!month) {
    return "Unknown period";
  }
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

//basically this function is used to format the currency in INR format. It takes a number as input and returns a string in the format of ₹1,00,000.00
export function formatCurrency(
    amount: number
) {
    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }
    ).format(amount);
}