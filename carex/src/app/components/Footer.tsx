export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white p-10 mt-10 text-center">
        <div className="flex justify-between">
          <div>
            <h4 className="font-bold">About Us</h4>
            <p>Career Explorer is your gateway to exciting career opportunities.</p>
          </div>
          <div>
            <h4 className="font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>Home</li>
              <li>Search</li>
              <li>Sign Up</li>
              <li>Log In</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold">Connect With Us</h4>
            <p>Facebook | Twitter | LinkedIn</p>
          </div>
        </div>
        <p className="mt-5 text-gray-500">© 2024 Career Explorer. All rights reserved.</p>
      </footer>
    );
  }
  