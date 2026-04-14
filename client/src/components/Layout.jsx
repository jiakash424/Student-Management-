import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="lg:ml-64 pt-4 pb-20 lg:pb-4 px-4 lg:px-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
