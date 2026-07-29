import { useEffect } from "react";
import { toast } from "react-hot-toast";

function Loader() {
  useEffect(() => {
    const loadingToast = toast.loading("Loading...");

    // Clean up the loading toast when the component unmounts
    return () => {
      toast.dismiss(loadingToast.id);
    };
  }, []); // Run this effect only once by passing an empty dependency array

  // Return null as the loader content will be handled by toast notification
  return null;
}

export default Loader;
