import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      {children}
      <Footer />
    </>
  );
} 