import "./styles.css";
import { requestUsers, User } from "./api";
import { useEffect, useState } from "react";
import { useDebounce } from "./utils";
import * as sea from "node:sea";

// interface User {
//   name: string;
//   id: number;
//   age: number;
// }

// interface Query {
//   name: string;
//   age: string;
//   limit: number;
//   offset: number;
// }

// Дана функция requestUsers с аргументом типа Query, которая возвращает
// Promise<User[]>

// Написать приложение по получению пользователей
// - показывать лоадер при загрузке пользователей
// - добавить фильтрацию по имени
// - добавить фильтрацию по возрасту
// - добавить пагинацию

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchAge, setSearchAge] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchName = useDebounce(searchName, 600);
  const debouncedSearchAge = useDebounce(searchAge, 600);
  useEffect(() => {
    const limit = 4;
    setIsLoading(true)
      const request = async () => {
        try {
          const fetchedUsers = await requestUsers({
            name: searchName,
            age: searchAge,
            limit: limit,
            offset: (page-1)*limit
          });
          setUsers(fetchedUsers);
        } catch (e) {
          alert((e as { message: string }).message);
          setUsers([]);
          setIsLoading(false)
        }
      };
      request().then(()=>{
        setIsLoading(false)
      });
  }, [debouncedSearchName,debouncedSearchAge,page]);


  return (
    <div>
      <input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Name" />
      <input value={searchAge}  onChange={(e) => setSearchAge(e.target.value)} style={{ marginLeft: "8px" }} placeholder="Age" type="number" />
      {
        isLoading?<p>Загрузка</p>:
        users.map((user, index) => (
        <div key={user.id} style={{ marginTop: index === 0 ? "16px" : "4px" }}>
          {user.name}, {user.age}
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <div>
          <span>By page:</span>
          <select value={page} onChange={(e) => setPage( parseInt(e.target.value))} style={{ marginLeft: "4px" }}>
            <option>2</option>
            <option>4</option>
            <option>8</option>
          </select>
        </div>
        <button onClick={()=>{setPage(prevState=>prevState>1?prevState-1:prevState)}}>prev</button>
        <span>page: {page}</span>
        <button onClick={()=>{setPage(prevState=>prevState+1)}}>next</button>
      </div>
    </div>
  );
}
