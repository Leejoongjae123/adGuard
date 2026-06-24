import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import SitemapFab from "../components/SitemapFab";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60">
        <TopBar />
        <main className="flex-1 p-6" style={{ background: "var(--color-bg)" }}>
          {children}
        </main>
      </div>
      <SitemapFab />
    </div>
  );
}
