import { StudentShell } from "@/components/student/student-shell";
import { StudentMapClient } from "@/components/student/student-map-client";

export default function StudentHomePage() {
  return (
    <StudentShell active="/student">
      <StudentMapClient />
    </StudentShell>
  );
}
