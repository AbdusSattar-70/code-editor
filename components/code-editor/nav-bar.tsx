import { Brain } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface NavBarProps {
  isDarkTheme: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ isDarkTheme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0"
  );
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
        toast.success("Profile Photo Updated Success!");
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <header
      className={`h-12 flex items-center justify-between ${
        isDarkTheme ? "bg-[#0e1525]" : "bg-gray-100/70"
      } transition-colors duration-300 shadow-sm sticky top-0`}
    >
      <div>
        <Link href="/">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent flex items-center">
            <Brain size={20} className="mr-2 text-blue-500" />
            LiCoderZ
          </h1>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center transition-transform hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 shadow-md">
            <img
              title="Upload Your Profile Photo"
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleProfileImageChange}
          accept="image/*"
        />
      </div>
    </header>
  );
};
