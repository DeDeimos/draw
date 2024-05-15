import { useState } from "react";
import s from "./index.module.scss";
import { useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../entities/user/userSlise";
import { Button } from "@mui/material";

export const AuthPage = () => {
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleLogin = () => {
    if (name.trim().length === 0) {
      return;
    }
    dispatch(setUser(name));
    navigate("/chat");
  };

  return (
    <div className={s.auth}>
      <div className={s.content}>
        <h1>DrawChat</h1>
        <input
          className={s.name_input}
          onChange={handleChangeName}
          placeholder="Введите имя"
          value={name}
        />
        <Button
        onClick={handleLogin}>
          Войти
        </Button>
        {/* <button
          className={s.button}
          onClick={handleLogin}
        >
            Войти
        </button> */}
      </div>
    </div>
  );
};
