import avatar3 from "@/public/images/avatar/avatar-3.jpg";
export const user = [
  {
    id: 1,
    name: "Emre Aksoy",
    image: avatar3,
    password: "!Emre5512",
    email: "emre@diogenestravel.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
];

export type User = (typeof user)[number];
