
function Footer() {
  return (
    <footer className="bg-gray-600 text-white font-bold p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span>© {new Date().getFullYear()} LMS Learn</span>
        <ul className="flex space-x-4">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;