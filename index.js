const express = require("express");
const bodyParser = require("body-parser");
const userRepo = require("./repositories/users");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/", async (request, response) => {
  const { email, password, passwordConfirmation } = request.body;
  const existingUser = await userRepo.getOnBy({ email });
  if (existingUser) {
    return response.send("the email exist!!");
  }
  if (password !== passwordConfirmation) {
    return response.send("password must be match!!");
  }
  response.send("Account created!!!");
});
app.listen("3000", () => {
  console.log("Listening ...");
});
