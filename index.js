const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const userRepo = require("./repositories/users");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["qaz1wsx2edc3"],
  })
);

app.get("/signup", (request, response) => {
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

app.post("/signup", async (request, response) => {
  const { email, password, passwordConfirmation } = request.body;
  const existingUser = await userRepo.getOnBy({ email });
  if (existingUser) {
    return response.send("the email exist!!");
  }
  if (password !== passwordConfirmation) {
    return response.send("password must be match!!");
  }

  const user = await userRepo.create({ email, password });
  request.session.userId = user.id;
  response.send("Account created!!!");
});

app.get("/signout", (request, response) => {
  request.session = null;
  response.send("You are logged out");
});

app.get("/signin", (request, response) => {
  response.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
});

app.post("/signin", async (request, response) => {
  const { email, password } = request.body;
  const user = await userRepo.getOnBy({ email });
  if (!user) {
    return response.send("Email not found");
  }
  const validPass = await userRepo.comparePassword(user.password, password);
  if (!validPass) {
    response.send("Invalid password");
  }
  request.session.userId = user.id;
  response.send("You are signed in!!");
});

app.listen("3000", () => {
  console.log("Listening ...");
});
