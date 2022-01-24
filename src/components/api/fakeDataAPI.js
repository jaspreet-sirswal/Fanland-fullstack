export const fetchData = (clubId) => {
  let club = null;
  data.map((item) => {
    if (item.id === clubId) club = item;
  });
  return club;
};

export const AddClubData = (club) => {
  data.push(club);
};

const data = [
  {
    name: "Cat Army",
    des: "The description of this club appear here.",
    image:
      "https://img.washingtonpost.com/rf/image_1484w/WashingtonPost/Content/Blogs/celebritology/Images/Film_Review_Dark_Knight_Rises-085d2-4549.jpg?uuid=ryK-otD1EeGt8tVushDNzQ",
    id: "cat_army",
    topFans: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    members: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    admin: "Maayami",
    chats: [
      {
        authorImage: "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
        author: "Mayank",
        message: "This message was sent by you!!",
        date: "",
      },
    ],
  },
  {
    name: "Andhadhun baatein",
    des: "The description of this club appear here.",
    image:
      "https://static.toiimg.com/thumb/msid-65705780,imgsize-105691,width-800,height-600,resizemode-75/65705780.jpg",
    id: "andhadhun_baatein",
    topFans: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    admin: "Maayami",
    members: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    chats: [
      {
        authorImage: "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
        author: "Mayank",
        message: "This message was sent by you!!",
        date: "",
      },
     
    ],
  },
  {
    name: "The MIB Force",
    des: "The description of this club appear here.",
    image:
      "http://sportofboxing.com/wp-content/uploads/2012/06/Challenging-Julius-Ballo-for-the-biggest-fan-club-is-Armando-Guerrero-500x320.jpg",
    id: "the_mib_force",
    topFans: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    admin: "Maayami",
    members: [
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
      {
        userName: "Maayami",
        profileImageUrl:
          "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
      },
    ],
    chats: [
      {
        authorImage: "https://pfpmaker.com/_nuxt/img/profile-3-1.3e702c5.png",
        author: "Mayank",
        message: "This message was sent by you!!",
        date: "",
      },
    ],
  },
];
