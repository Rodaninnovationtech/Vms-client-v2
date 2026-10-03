const Footer = () => {
  return (
    <footer className="h-12 bg-white border-t border-primary-50 flex items-center justify-between px-4 sm:px-6 text-xs text-slate-400 shrink-0">
      <p>© {new Date().getFullYear()} VMS 2.0. All rights reserved.</p>
      <p className="hidden sm:block">Visitor Management System · v2.0.0</p>
    </footer>
  );
};

export default Footer;
