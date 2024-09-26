import { Header } from "@/components/Header/Header";

const PublicRouteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='flex min-h-screen min-w-screen flex-col items-center bg-gradient-to-br from-[#42A6FB] to-[#5A4DFD] text-white'>
      <div className='container flex flex-col items-center justify-center gap-content p-outer'>
        <Header />
        {children}
      </div>
    </main>
  );
};

export default PublicRouteLayout;
