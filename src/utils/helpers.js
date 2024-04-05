import { getAuth, signOut } from "firebase/auth";
import { redirect } from "react-router-dom";

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

export const textElipsis = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export const authLoader = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return redirect("/login");
  }
  return user;
};

export const authPublicLoader = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return redirect("/");
  }
  return null;
};

export const handleLogout = () => {
  return signOut(getAuth())
}

export async function asyncMap(array, callback) {
  return await Promise.all(array.map(async item => await callback(item)));
}

export const createUrl = (url) => `${process.env.NODE_ENV==='development'?'http://localhost:3000':'http://localhost:3000'}/v1/${url}`;
