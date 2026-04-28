import { supabase } from "./supabase.js";

// LOGIN
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  // Get user role and org_id from org_members
  const { data: member, error: memberError } = await supabase
    .from("org_members")
    .select("role, org_id")
    .eq("user_id", data.user.id)
    .single();

  if (memberError || !member)
    return { error: "No role assigned. Contact admin." };

  // Store in sessionStorage
  sessionStorage.setItem("tita_role", member.role);
  sessionStorage.setItem("tita_user_id", data.user.id);
  sessionStorage.setItem("tita_org_id", member.org_id);

  // Redirect based on role
  redirectByRole(member.role);
}

// REDIRECT
export function redirectByRole(role) {
  const routes = {
    admin: "factory/dashboard-admin.html",
    store_manager: "factory/dashboard-store.html",
    production_manager: "factory/dashboard-production.html",
    marketing_manager: "factory/dashboard-marketing.html",
  };

  const path = routes[role];
  if (path) {
    window.location.href = path;
  } else {
    window.location.href = "login.html?error=invalid_role";
  }
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
  sessionStorage.clear();
  window.location.href = "../login.html";
}

// GUARD
export async function requireAuth(allowedRoles = []) {
  const role = sessionStorage.getItem("tita_role");

  if (!role) {
    window.location.href = "../login.html";
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    window.location.href = "../login.html?error=unauthorized";
    return null;
  }

  return role;
}
