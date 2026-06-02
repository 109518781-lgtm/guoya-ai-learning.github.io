export type AuthRole = "student" | "teacher";

export interface MockUser {
  account: string;
  password: string;
  role: AuthRole;
  displayName: string;
  canChangePassword: boolean;
}

export interface AuthSession {
  account: string;
  role: AuthRole;
  displayName: string;
}

export interface AuthProvider {
  signIn(account: string, password: string, role: AuthRole): Promise<AuthSession>;
  signOut(): Promise<void>;
}

export const mockUsers: MockUser[] = [
  {
    account: "teacher",
    password: "123456",
    role: "teacher",
    displayName: "国雅英语老师",
    canChangePassword: true
  },
  {
    account: "student",
    password: "123456",
    role: "student",
    displayName: "李明",
    canChangePassword: false
  }
];

export const authStorageKey = "guoya_mock_auth_session";

export async function mockSignIn(
  account: string,
  password: string,
  role: AuthRole
): Promise<AuthSession> {
  const user = mockUsers.find(
    (item) => item.account === account && item.password === password && item.role === role
  );

  if (!user) {
    throw new Error("账号或密码不正确");
  }

  return {
    account: user.account,
    role: user.role,
    displayName: user.displayName
  };
}

export function getRoleHome(role: AuthRole) {
  return role === "student" ? "/student" : "/teacher";
}

// Future adapters can implement AuthProvider with Supabase Auth or NextAuth.
export const mockAuthProvider: AuthProvider = {
  signIn: mockSignIn,
  async signOut() {
    return Promise.resolve();
  }
};
