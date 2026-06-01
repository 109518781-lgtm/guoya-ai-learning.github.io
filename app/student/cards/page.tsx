import { StudentShell } from "@/components/student/student-shell";
import { CardsClient } from "@/components/student/cards-client";

export default function StudentCardsPage() {
  return (
    <StudentShell active="/student/cards">
      <CardsClient />
    </StudentShell>
  );
}
