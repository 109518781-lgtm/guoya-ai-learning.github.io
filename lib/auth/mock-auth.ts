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
  studentId?: string;
  teacherId?: string;
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
  if (typeof window !== "undefined") {
    const { loadPlatformState } = await import("@/lib/learning-store");
    const state = loadPlatformState();
    if (role === "student") {
      const student = state.students.find((item) => item.account === account && item.password === password);
      if (student) {
        return {
          account: student.account,
          role: "student",
          displayName: student.name,
          studentId: student.id
        };
      }
    }
    if (role === "teacher") {
      const teacher = state.teachers.find((item) => item.account === account && item.password === password);
      if (teacher) {
        return {
          account: teacher.account,
          role: "teacher",
          displayName: teacher.name,
          teacherId: teacher.id
        };
      }
    }
  }

  const user = mockUsers.find(
    (item) => item.account === account && item.password === password && item.role === role
  );
  if (!user) {
    throw new Error("账号或密码不正确");
  }

  return {
    account: user.account,
    role: user.role,
    displayName: user.displayName,
    studentId: user.role === "student" ? "student-demo" : undefined,
    teacherId: user.role === "teacher" ? "teacher-demo" : undefined
  };
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(authStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
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
