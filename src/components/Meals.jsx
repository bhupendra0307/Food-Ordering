// import { useState, useEffect } from "react";
import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.jsx";
import Error from "./Error.jsx";

const requestConfig = {};

export default function Meals() {
  // const [loadedMeals, setLoadedMeals] = useState([]);

  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  // We'll need to send a GET request to /meals on the backend
  // GET /meals
  // can send an HTTP request by using the builtin fetch() function. this fuction takes the URL of the server to which you want to send a request as an input And here that's http://localhost:3000/meals . because that is end point target and fetch methods return promise()

  /*  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch("http://localhost:3000/meals"); // awaiting a response the data
      if (!response.ok) {
        // ....
      }
      // and the extraction of the data, it makes sense that the meals data  will not be available instantly when this components function is executed.
      const meals = await response.json(); // convert
      setLoadedMeals(meals);
    }
    fetchMeals();
  }, []);  // allows us to run side effects after the component rendered, and it alos allows us to define a dependenies array that controls when exactly the side effect function run
*/
  // the next step now is to update the UI with that meals data.

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  // if(!data){
  //   return <p>No meals found...</p>
  // }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        // <li key={meal.id}>{meal.name}</li>
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
