import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Autocomplete from "./components/autocomplete";

function App() {
  // const staticData = ["apple", "bannana", "lemon"];

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [data, setdata] = useState([]);
  const [name, setName] = useState("");
  const [checkedIds, setCheckedIds] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/data`)
      .then((res) => {
        setdata(res.data);
      })
      .catch((error) => {
        console.error("Error fetching the data: ", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${apiBaseUrl}/add`, { name })
      .then(() => {
        axios.get(`${apiBaseUrl}/data`).then((res) => {
          setdata(res.data);
        });
      })
      .catch((err) => {
        console.error("Error adding data: ", err);
      });

    setName("");
  };

  // const handleDelete = (name) => {
  //   axios
  //     .delete("http://localhost:3001/delete", { data: { name } })
  //     .then((res) => {
  //       console.log(res.data);
  //       // Optionally, refresh the data after deletion
  //       setdata(data.filter((item) => item.name !== name));
  //     })
  //     .catch((err) => {
  //       console.error("Error deleting the data: ", err);
  //     });
  // };

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/recipes/search?q=${query}`
      );
      return response.data.recipes;
    } catch (err) {
      console.error("Fetching suggestions failed: ", err);
    }
  };

  const handleChecboxSelect = (id) => {
    setCheckedIds((previousCheckedId) => {
      if (previousCheckedId.includes(id)) {
        // if the id is in the list, remove it
        return previousCheckedId.filter((item) => item !== id);
      } else {
        // if the id is not in the list, add it
        return [...previousCheckedId, id];
      }
    });
  };

  const handleDelete = () => {
    if (checkedIds.length === 0) return;

    axios
      .delete(`${apiBaseUrl}/delete`, { data: { ids: checkedIds } })
      .then(() => {
        setdata(data.filter((item) => !checkedIds.includes(item.id)));
      })
      .catch((err) => {
        console.error("Error deleting the data: ", err);
      });
  };

  // const fetchSuggestions = async (query) => {
  //   const response = await fetch(
  //     `https://dummyjson.com/recipes/search?q=${query}`
  //   );
  //   if (!response.ok) {
  //     throw new Error("Network response was not ok");
  //   }
  //   const result = await response.json();
  //   return result.recipes;
  // };

  return (
    <>
      <div className=" flex justify-between overflow-x-auto w-full">
        <ul className="max-w-full">
          {data.map((item, index) => {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={checkedIds.includes(item.id)}
                  onChange={() => handleChecboxSelect(item.id)}
                />
                {item.name}
              </li>
            );
          })}
        </ul>
        <button onClick={handleDelete}> Delete checked</button>
      </div>

      <div className="max-w-full overflow-x-hidden">
        <Autocomplete
          placeholder="Search for recipe"
          // staticData={staticData}
          fetchSuggestions={fetchSuggestions}
          resultKey={"name"}
          customLoading={<>...Loading recipes</>}
          onSelect={(res) => console.log(res)}
          onChange={() => {}}
          onBlur={() => {}}
          onFocus={() => {}}
          customStyles={{}}
        />
      </div>

      <form onSubmit={handleSubmit} className="max-w-full overflow-x-hidden">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter the name"
        />

        <button type="submit">Handle submit</button>
      </form>
    </>
  );
}

export default App;
