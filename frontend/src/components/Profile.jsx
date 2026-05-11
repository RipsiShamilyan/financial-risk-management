import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import '../css/Profile.css';

const Profile = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:5000/profile/${userId}`)
        .then((response) => {
          setUserData(response.data);
          setValue("username", response.data.username);
          setValue("email", response.data.email);
        })
        .catch((error) => {
          console.error('Սխալ տվյալների ստացման ժամանակ:', error);
        });
    }
  }, [setValue]);

  const onSubmit = (data) => {
    const userId = localStorage.getItem("userId");

    if (data.newPassword !== data.confirmPassword) {
      alert("Գաղտնաբառերը չեն համընկնում");
      return;
    }

    axios
      .put(`http://localhost:5000/profile/${userId}`, {
        username: data.username,
        email: data.email,
        password: data.newPassword,
      })
      .then((response) => {
        alert("Տվյալները հաջողությամբ թարմացվել են");
      })
      .catch((error) => {
        console.error("Սխալ տվյալների թարմացման ժամանակ:", error);
        alert("Սխալ տվյալների թարմացման ժամանակ");
      });
    reset();
  };

  return (
    <div className="profile-container">
      <h2 className="profile-header">Անձնական տվյալներ</h2>
      <form className="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Անուն</label>
          <input
            type="text"
            id="username"
            className="form-input"
            {...register("username", { required: "Անունը պարտադիր է" })}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Էլ-փոստ</label>
          <input
            type="email"
            id="email"
            className="form-input"
            {...register("email", {
              required: "Էլ. փոստը պարտադիր է",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "Անվավեր էլփոստի հասցե",
              },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">Նոր գաղտնաբառ</label>
          <input
            type="password"
            id="newPassword"
            className="form-input"
            {...register("newPassword", { required: "Նոր գաղտնաբառը պարտադիր է", pattern:{
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/,
              message:"Պետք է պարունակի առնվազն մեկ փոքրատառ, մեկ մեծատառ, մեկ թիվ, մեկ սիմվոլ 8-ից 16 նիշ"
            }})}
          />
          {errors.newPassword && <p className="error-message">{errors.newPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Հաստատել գաղտնաբառը</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            {...register("confirmPassword", {
              required: "Հաստատման գաղտնաբառը պարտադիր է",
              validate: value =>
                value === newPassword || "Գաղտնաբառերը չեն համընկնում",
            })}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="submit-button">Թարմացնել</button>
      </form>
    </div>
  );
};

export default Profile;
