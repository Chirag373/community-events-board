import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminBoard from "@/components/admin-board";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") {
    return (
      <main className="narrow-page">
        <h1>Admin access required</h1>
        <p>This page is available to the community admin.</p>
      </main>
    );
  }
  return <AdminBoard />;
}
