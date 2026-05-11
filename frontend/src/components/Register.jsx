import React, { useState } from 'react';
import '../css/Register.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    const { email, username, password } = data;

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError('Սխալ գրանցման ժամանակ');
    }
  };

  return (
    <div className="register-container">
      <h2>Գրանցվել</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Էլ-փոստ"
          {...register("email", {
            required: "Էլ-փոստը պարտադիր է",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Անվավեր էլ-փոստի ձևաչափ",
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="text"
          placeholder="Օգտվողի անուն"
          {...register("username", {
            required: "Օգտվողի անունը պարտադիր է",
            minLength: {
              value: 3,
              message: "Անունը պետք է լինի առնվազն 3 նիշ",
            },
          })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <input
          type="password"
          placeholder="Գաղտնաբառ"
          {...register("password", {
            required: "Գաղտնաբառը պարտադիր է",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/,
              message: "Գաղտնաբառը պետք է պարունակի մեծատառ, փոքրատառ, թիվ, սիմվոլ և լինի 8-16 նիշ",
            },
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Հաստատել գաղտնաբառը"
          {...register("confirmPassword", {
            required: "Խնդրում ենք հաստատել գաղտնաբառը",
            validate: (value) =>
              value === password || "Գաղտնաբառերը չեն համընկնում",
          })}
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

        <button type="submit">Գրանցվել</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Register;
