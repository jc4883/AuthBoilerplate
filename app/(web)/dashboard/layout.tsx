export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>{'I am navbar'}</nav>

      {children}
    </section>
  );
}
