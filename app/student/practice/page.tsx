import { StudentShell } from "@/components/student/student-shell";
import { PracticeClient } from "@/components/student/practice-client";

export default function PracticePage() {
  return (
    <StudentShell active="/student/practice">
      <PracticeClient />
    </StudentShell>
  );
}
