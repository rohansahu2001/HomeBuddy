var express = require("express");
var router = express.Router();
var Razorpay = require("razorpay");
const userModel = require("./users");
const orderModel = require("./orderSchema");
const serviceCategoryModel = require("./serviceCategory");
const passport = require("passport");
const localStrategy = require("passport-local");
// const { default: paymentLink } = require("razorpay/dist/types/paymentLink");
passport.use(new localStrategy(userModel.authenticate()));
const createCategoryDB = () => {
  serviceCategoryModel
    .create(
      {
        serviceName: "Cleaning-Services",
        servicePoster: "1.png",
        serviceCategory: [
          {
            name: "Full House Cleaning",
            price: 1549,
          },
          {
            name: "Sofa Cleaning",
            price: 499,
          },
          {
            name: "Bath Room Cleaning",
            price: 649,
          },
          {
            name: "Overhead Water Tank Cleaning",
            price: 699,
          },
        ],
      },
      {
        serviceName: "Electrician",
        servicePoster: "2.png",
        serviceCategory: [
          {
            name: "Appliances",
            price: 349,
          },
          {
            name: "AC Repair and Installation",
            price: 499,
          },
          {
            name: "Electric Board",
            price: 199,
          },
          {
            name: "Desert Cooler",
            price: 399,
          },
        ],
      },
      {
        serviceName: "Beauty-Salon",
        servicePoster: "3.png",
        serviceCategory: [
          {
            name: "Waxing",
            price: 899,
          },
          {
            name: "Manicure & Pedicure",
            price: 1299,
          },
          {
            name: "Facials and Cleanups",
            price: 699,
          },
          {
            name: "Makeup Artist",
            price: 1999,
          },
        ],
      },
      {
        serviceName: "Home-Tutor",
        servicePoster: "4.png",
        serviceCategory: [
          {
            name: "Maths & Science",
            price: 4999,
          },
          {
            name: "Commerce",
            price: 3500,
          },
          {
            name: "Web Development",
            price: 4999,
          },
          {
            name: "English",
            price: 3999,
          },
        ],
      },
      {
        serviceName: "Painter",
        servicePoster: "5.png",
        serviceCategory: [
          {
            name: "Water Proofing",
            price: 499,
          },
          {
            name: "House Painting",
            price: 1249,
          },
          {
            name: "Wall Texture Painting",
            price: 299,
          },
          {
            name: "Boundary Wall Painting",
            price: 399,
          },
        ],
      },
      {
        serviceName: "Physiotherapy",
        servicePoster: "6.png",
        serviceCategory: [
          {
            name: "Paralysis Physiotherapy",
            price: 449,
          },
          {
            name: "Post Injury Physiotherapist",
            price: 449,
          },
          {
            name: "Cervical Physiotherapist",
            price: 449,
          },
          {
            name: "Backbone/Frozen Shoulder Physiotherapist",
            price: 449,
          },
        ],
      },
      {
        serviceName: "Digital-Marketing",
        servicePoster: "7.png",
        serviceCategory: [
          {
            name: "Web App",
            price: "1999",
          },
          {
            name: "Web Designing",
            price: "9999",
          },
          {
            name: "Domain Hosting",
            price: "499",
          },
          {
            name: "Server Management",
            price: "4999",
          },
        ],
      },
      {
        serviceName: "Home-Move",
        servicePoster: "8.png",
        serviceCategory: [
          {
            name: "1 BHK",
            price: "3999-7999",
          },
          {
            name: "2 BHK",
            price: "3999 – 9999",
          },
          {
            name: "3 BHK",
            price: "4999 – 12999",
          },
          {
            name: "4 or 5 BHK",
            price: "6000 - 17999",
          },
        ],
      }
    )

    .then((data) => {
      console.log(data);
    });
};

createCategoryDB();

router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/acCreate", function (req, res, next) {
  res.render("acCreate");
});
router.get("/cart", isLoggedIn, async function (req, res, next) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  let cartData = await orderModel.find({ userId: user._id });
  console.log(cartData);
  res.render("cart", { data: cartData });
});
router.get("/acLogin", function (req, res, next) {
  res.render("acLogin");
});
router.get("/payment", function (req, res, next) {
  res.render("payment.hbs");
});
router.get(
  "/service/:serviceName",
  isLoggedIn,
  async function (req, res, next) {
    let serviceData = await serviceCategoryModel.findOne({
      serviceName: req.params.serviceName,
    });
    res.render("service", { data: serviceData });
  }
);
router.post("/createOrder", isLoggedIn, async function (req, res, next) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  var data = {
    service: req.body.serviceName,
    price: req.body.price,
    date: req.body.date,
    prefferedTime: req.body.time,
    address: req.body.address,
    instruction: req.body.instruc,
    userId: user,
  };
  console.log(data);
  let order = await orderModel.create(data);
  user.orderId.push(order);
  await user.save();
  res.redirect("/cart");
});

router.post("/register", function (req, res) {
  var newUser = new userModel({
    fullname: req.body.fullname,
    email: req.body.email,
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
  });
  userModel
    .register(newUser, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/acLogin",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/acLogin");
  }
}

function alreadyLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/userProfile");
  } else {
    return next();
  }
}
// paymen
var instance = new Razorpay({
  key_id: "rzp_test_pl4JNYkSF9Nibj",
  key_secret: "zwMEEWkyXzmrAm2i6sZQVKaU",
});

router.get("/payments", function (req, res, next) {
  res.render("payment.hbs");
});

router.post("/create/orderId", function (req, res) {
  var options = {
    amount: 50000,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    return res.send(order);
  });
});

router.post("/api/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "A0ETOcXCfUXgupemi1uCptXr")
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.send(response);
});

router.get("/success", function (req, res) {
  res.render("success");
});

module.exports = router;

console.log("Server is activated on http://localhost:3000");
