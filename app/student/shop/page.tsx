import { StudentShell } from "@/components/student/student-shell";
import { ShopClient } from "@/components/student/shop-client";

export default function StudentShopPage() {
  return (
    <StudentShell active="/student/shop">
      <ShopClient />
    </StudentShell>
  );
}
