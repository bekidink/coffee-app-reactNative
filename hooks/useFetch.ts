import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCoffeeList, setBeanList } from "./slices/coffeeSlice"; // Adjust the path if needed

// Define a custom hook to fetch the coffee list
const useFetchCoffeeList = (type: "Coffee" | "Bean") => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoffeeList = async () => {
      try {
        const response = await fetch(
          `http://192.168.43.97:3000/api/coffees?type=${type}`
        ); // Replace with your backend API URL
        if (!response.ok) {
          throw new Error("Failed to fetch coffee list");
        }
        const data = await response.json();
        if (type === "Coffee") {
          dispatch(setCoffeeList(data));
        } else if (type === "Bean") {
          dispatch(setBeanList(data));
        } // Dispatch the data to the Redux store
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCoffeeList();
  }, [dispatch]);

  return { loading, error };
};

export default useFetchCoffeeList;
