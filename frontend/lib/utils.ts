import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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