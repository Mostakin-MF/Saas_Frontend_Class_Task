export type StaffStoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  role: "staff";
};

const STAFF_USER_KEY = "eventhub_staff_user";
const STAFF_LOGIN_KEY = "eventhub_staff_isLoggedIn";

export function getStaffStoredUser(): StaffStoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STAFF_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StaffStoredUser;
  } catch {
    return null;
  }
}

export function setStaffStoredUser(user: StaffStoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
}

export function setStaffLoggedIn(value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STAFF_LOGIN_KEY, value ? "true" : "false");
}

export function isStaffLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STAFF_LOGIN_KEY) === "true";
}

export function staffLogout() {
  if (typeof window === "undefined") return;

}
