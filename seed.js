const mongoose = require("mongoose");
const User = require("./src/models/user.js");
const Post = require("./src/models/post.js");
const PostImage = require("./src/models/postImage.js");
const Comment = require("./src/models/comment.js");

async function seedDatabase() {
  try {
    await mongoose.connect(
      "mongodb://admin:admin123@localhost:27017/redsocial?authSource=admin"
    );

    const users = [
      {
        _id: "6877e4efb85e8f79c12f431d",
        userName: "valen_12",
        password: "1234vaLen",
        email: "valeng12@gmail.com",
        password: "hoy123456",
        firstName: "Valentina",
        lastName: "Perez",
        bio: "Me encanta la moda sostenible y el intercambio de ropa.",
        location: "Buenos Aires",
        reputation: 5,
        avatar: "https://i.pravatar.cc/150?img=1",
        history: [],
      },
      {
        _id: "6877e4f5416c8df2b828b5e5",
        userName: "lunaaU",
        password: "1234naLulu",
        email: "lunaau23@gmail.com",
        password: "hoy123456",
        firstName: "Luna",
        lastName: "Ulloa",
        bio: "Apasionada por las prendas vintage y el reciclaje.",
        location: "Córdoba",
        reputation: 7,
        avatar: "https://i.pravatar.cc/150?img=2",
        history: [],
      },
      {
        _id: "6877e4fc4ec2f21d067a4d06",
        userName: "juanJT",
        password: "1234Juancito",
        email: "juanjt.34@gmail.com",
        password: "hoy123456",
        firstName: "Juan",
        lastName: "Torres",
        bio: "Fanático del estilo urbano y los accesorios únicos.",
        location: "Rosario",
        reputation: 6,
        avatar: "https://i.pravatar.cc/150?img=3",
        history: [],
      },
      {
        _id: "68782074b4e57faaceb3c823",
        userName: "miraYapu",
        password: "1234miraYapu",
        email: "mirayapura@gmail.com",
        password: "hoy123456",
        firstName: "Miranda",
        lastName: "Yapur",
        bio: "Disfruto de la moda ecológica y compartir looks.",
        location: "Mendoza",
        reputation: 8,
        avatar: "https://i.pravatar.cc/150?img=4",
        history: [],
      },
      {
        _id: "68782b1ebe059749e619ef2b",
        userName: "robyR3",
        password: "1234RobyR3",
        email: "roobyr.3@gmail.com",
        password: "hoy123456",
        firstName: "Roberto",
        lastName: "Rodriguez",
        bio: "Buscando siempre nuevas formas de intercambiar ropa.",
        location: "La Plata",
        reputation: 4,
        avatar: "https://i.pravatar.cc/150?img=5",
        history: [],
      },
    ];

    const postimages = [
      {
        _id: "286eca120fbeba9a94adfb47",
        postId: "686eca120fbeba9a94adbb65",
        imageUrl:
          "https://i.postimg.cc/MZFM5hfr/Vestido-negro-corto-con-escote-en-V-talle-XS.png",
      },
      {
        _id: "336eca120fbeba9a94adfbe5",
        postId: "686eca120fbeba9a94adbb65",
        imageUrl:
          "https://i.postimg.cc/02K6Bcp5/Vestido-negro-corto-con-escote-en-V-talle-XS-img2.png",
      },
      {
        _id: "322eca120fbeba9a94adfff5",
        postId: "6834ea120fbeba9a94adbd67",
        imageUrl:
          "https://i.postimg.cc/Xvvqb8Tz/Top-rosa-manga-larga-escote-cuadrado-talle-S.jpg",
      },
      {
        _id: "452e23120fbeba9a94adaaf5",
        postId: "1235ea120fbeba9a94adbd68",
        imageUrl:
          "https://i.postimg.cc/Jzczfgt8/Campera-bomber-bord-talle-L.png",
      },
      {
        _id: "6878285df1419705bea9f8ae",
        postId: "68782746bcd36f384ad6cedb",
        imageUrl:
          "https://i.postimg.cc/50SfQFdC/Campera-de-cuero-negra-para-hombres-talle-M.jpg",
      },
    ];

    const comments = [
      {
        _id: "6877e18df0bbf8c9c57c2e03",
        postId: "686eca120fbeba9a94adbb65",
        userId: "68782074b4e57faaceb3c823",
        text: "Está muy lindo el vestido!",
      },
      {
        _id: "6877e194485d73e7dee0b47f",
        postId: "6834ea120fbeba9a94adbd67",
        userId: "6877e4efb85e8f79c12f431d",
        text: "Tengo una remera manga larga lila nueva ¿Cambiamos?",
      },
      {
        _id: "6877e19e468f867b26c5b141",
        postId: "1235ea120fbeba9a94adbd68",
        userId: "6877e4f5416c8df2b828b5e5",
        text: "Que linda campera para salir!",
      },
      {
        _id: "6877e1a4643decc5f76b22ce",
        postId: "1235ea120fbeba9a94adbd68",
        userId: "68782b1ebe059749e619ef2b",
        text: "Creo tener una campera como la que buscás...",
      },
    ];

    const posts = [
      {
        _id: "686eca120fbeba9a94adbb65",
        userId: "6877e4efb85e8f79c12f431d",
        description: "Vestido negro corto con escote en V talle XS",
        lookingFor: "Busco un pantalón cargo negro de pierna recta talle L",
        images: ["286eca120fbeba9a94adfb47", "336eca120fbeba9a94adfbe5"],
        status: "available",
        requestedBy: null,
        exchangedWith: null,
      },
      {
        _id: "6834ea120fbeba9a94adbd67",
        userId: "6877e4f5416c8df2b828b5e5",
        description: "Top rosa manga larga, escote cuadrado talle S",
        lookingFor: "Remera manga larga de color lila y estampado liso talle S",
        images: ["322eca120fbeba9a94adfff5"],
        status: "completed",
        requestedBy: "6877e4efb85e8f79c12f431d", // otro usuario
        exchangedWith: "6877e4efb85e8f79c12f431d", // otro usuario
      },
      {
        _id: "1235ea120fbeba9a94adbd68",
        userId: "6877e4fc4ec2f21d067a4d06",
        description: "Campera bomber bordó talle L",
        lookingFor: "Campera inflable gris talle XL",
        images: ["452e23120fbeba9a94adaaf5"],
        status: "engaged",
        requestedBy: "68782b1ebe059749e619ef2b",
        exchangedWith: null,
      },
      {
        _id: "68782746bcd36f384ad6cedb",
        userId: "68782b1ebe059749e619ef2b",
        description: "Campera de cuero negra para hombres talle M",
        lookingFor:
          "Campera de cuero con corderito marrón, preferentemente talle M",
        images: ["6878285df1419705bea9f8ae"],
        status: "available",
        requestedBy: null,
        exchangedWith: null,
      },
    ];

    // Borrado previo
    await User.deleteMany();
    await PostImage.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    // Inserción
    await User.insertMany(users);
    await PostImage.insertMany(postimages);
    await Post.insertMany(posts);
    await Comment.insertMany(comments);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
