export const fetchUser = (userName) => {
  let user = null;
  users.map((item) => {
    if (item.userName === userName) {
      user = item;
    }
  });
  return user;
};

export const fetchUserClubs = (userName, endpoint) => {
  let user = null;
  users.map((item) => {
    if (item.userName === userName) user = item;
  });
  switch (endpoint) {
    case "following_clubs":
      return user.followingClubs;
    case "admin_clubs":
      return user.adminClubs;
    case "liked_clubs":
      return user.likedClubs;

    default:
      return user.interest;
  }
};

const users = [
  {
    userName: "Maayami",
    userPassword: "pass123#Fland",
    email: "mayank_m@cs.iitr.ac.in",
    profileImageUrl: "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
    interest: ["the_mib_force", "cat_army", "andhadhun_baatein"],
    followingClubs: [
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
      "cat_army",
    ],
    adminClubs: [
      "andhadhun_baatein",
      "the_mib_force",
      "the_mib_force",
      "cat_army",
      "andhadhun_baatein",
      "the_mib_force",
    ],
    likedClubs: ["cat_army"],
  },
];
