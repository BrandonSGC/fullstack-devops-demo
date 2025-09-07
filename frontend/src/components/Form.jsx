import { useState } from "react";
import { createUser } from "../api/users";
import "./Form.css";

export const Form = ({setUsers}) => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [response, setResponse] = useState({});

  const onInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Logic to send form data to the backend
    const response = await createUser(form);
    setResponse(response);
    console.log(response);

    // Clear message after 3 seconds
    setTimeout(() => {
      setResponse({});
    }, 3000);

    if (!response.success) return;

    // Update users list in parent component
    setUsers((prevUsers) => [...prevUsers, response.user]);

    // Clear form
    setForm({
      name: "",
      surname: "",
      email: "",
    });
  };

  return (
    <>
      <form className="form" onSubmit={onSubmit}>
        <h2>Create User Form</h2>
        <div className="form__group">
          <label className="form__label" htmlFor="name">
            Name:{" "}
          </label>
          <input
            value={form.name}
            onChange={onInputChange}
            type="text"
            id="name"
            name="name"
          />
        </div>
        <div className="form__group">
          {" "}
          <label className="form__label" htmlFor="surname">
            Surname:{" "}
          </label>
          <input
            value={form.surname}
            onChange={onInputChange}
            type="text"
            id="surname"
            name="surname"
          />
        </div>
        <div className="form__group">
          {" "}
          <label className="form__label" htmlFor="email">
            Email:{" "}
          </label>
          <input
            value={form.email}
            onChange={onInputChange}
            type="email"
            id="email"
            name="email"
          />
        </div>

        <button className="form__submit">Create User</button>
        {/* TODO: show success or error message */}
        {/* Show the following text for 3 seconds with the message from the backend */}
        <p
          className={`form__message ${
            response.success ? "form__message--success" : "form__message--error"
          }`}
        >
          {response.message}
        </p>
      </form>
    </>
  );
};
