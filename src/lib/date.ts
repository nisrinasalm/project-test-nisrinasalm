import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(date: Date) {
  const formattedDate = new Date(date);
  return format(formattedDate, "dd MMMM yyyy", { locale: id });
}
