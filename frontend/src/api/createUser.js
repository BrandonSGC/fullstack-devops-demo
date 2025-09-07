export const createUser = async (userData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
