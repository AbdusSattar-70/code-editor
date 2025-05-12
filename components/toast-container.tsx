import { ToastContainer } from "react-toastify";
interface ToastContainerCustomProps {
  isDarkTheme: boolean;
}
export const ToastContainerCustom: React.FC<ToastContainerCustomProps> = ({
  isDarkTheme,
}) => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkTheme ? "dark" : "light"}
    />
  );
};
