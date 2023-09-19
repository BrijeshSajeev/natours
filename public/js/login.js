/* eslint-disable */

const login = async (email, password) => {
  console.log(email, password);
  const data = {
    email,
    password,
  };

  try {
    url = `http://localhost:3000/api/v1/users/login`;
    const response = await axios({
      method: 'POST',
      url,
      data,
    });
    console.log(response);
    // const responseData = await response.json();
    // console.log(responseData);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
