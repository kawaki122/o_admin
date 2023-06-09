
export const createTimeInterval = (f, t) => {
  let result = "";
  let to = new Date(t);
  let from = new Date(f);

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  // Adjust for negative differences
  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    var lastMonthDate = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += lastMonthDate;
    months--;
  }
  if (years) {
    result += `${years}Year${years > 1 ? "s" : ""} `;
  }
  if (months) {
    result += `${months}Month${months > 1 ? "s" : ""} `;
  }
  if (days) {
    result += `${days}Days`;
  }
  return result;
};
