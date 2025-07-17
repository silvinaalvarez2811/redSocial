const mongoose = require('mongoose');
const User = require('./src/models/user.js'); 
const Post = require('./src/models/post.js'); 
const PostImage = require('./src/models/postImage.js'); 
const Comment = require('./src/models/comment.js'); 

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb://admin:admin123@localhost:27017/redsocial?authSource=admin');

    // Sample user data
    const users = [
            {
                '_id': '6877e4efb85e8f79c12f431d',
                'userName': 'valen_12',
                'email': 'valeng12@gmail.com',
            },
            {
                '_id': '6877e4f5416c8df2b828b5e5',
                'userName': 'lunaaU',
                'email': 'lunaau23@gmail.com',
            },
            {
                '_id': '6877e4fc4ec2f21d067a4d06',
                'userName': 'juanJT',
                'email': 'juanjt.34@gmail.com',
            },
            {
                '_id': '68782074b4e57faaceb3c823',
                'userName': 'miraYapu',
                'email': 'mirayapura@gmail.com',
            },
            {
                '_id': '68782b1ebe059749e619ef2b',
                'userName': 'robyR3',
                'email': 'roobyr.3@gmail.com',
            }
        ];

    const postimages = [
            {
                '_id': '286eca120fbeba9a94adfb47',
                'postId': '686eca120fbeba9a94adbb65',
                'imageUrl': 'https://i.postimg.cc/MZFM5hfr/Vestido-negro-corto-con-escote-en-V-talle-XS.png'
            },
            {
                '_id': '336eca120fbeba9a94adfbe5',
                'postId': '686eca120fbeba9a94adbb65',
                'imageUrl': 'https://i.postimg.cc/02K6Bcp5/Vestido-negro-corto-con-escote-en-V-talle-XS-img2.png'
            },
            {
                '_id': '322eca120fbeba9a94adfff5',
                'postId': '6834ea120fbeba9a94adbd67',
                'imageUrl': 'https://i.postimg.cc/Xvvqb8Tz/Top-rosa-manga-larga-escote-cuadrado-talle-S.jpg'
            },
            {
                '_id': '452e23120fbeba9a94adaaf5',
                'postId': '1235ea120fbeba9a94adbd68',
                'imageUrl': 'https://i.postimg.cc/Jzczfgt8/Campera-bomber-bord-talle-L.png'
            },
            {
                '_id': '6878285df1419705bea9f8ae',
                'postId': '68782746bcd36f384ad6cedb',
                'imageUrl': 'https://i.postimg.cc/50SfQFdC/Campera-de-cuero-negra-para-hombres-talle-M.jpg'
            }
        ]

    const comments = [
            {
                '_id': '6877e18df0bbf8c9c57c2e03',
                'postId': '686eca120fbeba9a94adbb65',
                'userId': '68782074b4e57faaceb3c823',
                'text': 'Está muy lindo el vestido!',
            },
            {
                '_id': '6877e194485d73e7dee0b47f',
                'postId': '6834ea120fbeba9a94adbd67',
                'userId': '6877e4efb85e8f79c12f431d',
                'text': 'Tengo una remera manga larga lila nueva ¿Cambiamos?',
            },
            {
                '_id': '6877e19e468f867b26c5b141',
                'postId': '1235ea120fbeba9a94adbd68',
                'userId': '6877e4f5416c8df2b828b5e5',
                'text': 'Que linda campera para salir!',
            },
            {
                '_id': '6877e1a4643decc5f76b22ce',
                'postId': '1235ea120fbeba9a94adbd68',
                'userId': '68782b1ebe059749e619ef2b',
                'text': 'Creo tener una campera como la que buscás...',
            }
        ];

    const posts = [
            {
                '_id': '686eca120fbeba9a94adbb65',
                'userId': '6877e4efb85e8f79c12f431d',
                'description': 'Vestido negro corto con escote en V talle XS',
                'lookingFor': 'Busco un pantalón cargo negro de pierna recta talle L',
                'images': ['286eca120fbeba9a94adfb47', '336eca120fbeba9a94adfbe5'],
                'tags': ['6877de31caabab88b2dcc34b', '6877de47f6760c152ba56732']
            },
            {
                '_id': '6834ea120fbeba9a94adbd67',
                'userId': '6877e4f5416c8df2b828b5e5',
                'description': 'Top rosa manga larga, escote cuadrado talle S',
                'lookingFor': 'Remera manga larga de color lila y estampado liso talle S',
                'images': ['322eca120fbeba9a94adfff5'],
                'tags': ['6877de39129c9cadf51d34ea', '6877de4180f5517bc976bba7']
            },
            {
                '_id': '1235ea120fbeba9a94adbd68',
                'userId': '6877e4fc4ec2f21d067a4d06',
                'description': 'Campera bomber bordó talle L',
                'lookingFor': 'Campera inflable gris talle XL',
                'images': ['452e23120fbeba9a94adaaf5'],
                'tags': ['6877e0af57ebe455d89ba7e3', '6877e0fc1ad933b623be80f5']
            },
            {
                '_id': '68782746bcd36f384ad6cedb',
                'userId': '68782b1ebe059749e619ef2b',
                'description': 'Campera de cuero negra para hombres talle M',
                'lookingFor': 'Campera de cuero con corderito marrón, preferentemente talle M',
                'images': ['6878285df1419705bea9f8ae'],
            },
        ];

    await User.deleteMany();
    await PostImage.deleteMany();
    await Post.deleteMany();  
    await Comment.deleteMany();

    await User.insertMany(users);
    await PostImage.insertMany(postimages);
    await Post.insertMany(posts);  
    await Comment.insertMany(comments);
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();