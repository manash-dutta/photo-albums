import Navbar from "./components/Navbar";
import AlbumList from "./components/AlbumsList";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Navbar />
      <AlbumList />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
