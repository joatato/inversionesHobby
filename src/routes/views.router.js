import { Router } from 'express';
// DEBO CAMBIARLO A proyectManagerDB.js . Pero por el momento no me anda asi que lo dejamos así.
import { projectsModel } from '../dao/models/projects.models.js';
// import { MiRouter } from './layout/router.js'
import session from 'express-session';
import { passportCall } from '../utils/jwt.utils.js';



const router = Router();
// const pm = new proyectManager();

//Autorizacion
//A todo esto lo debo de incluir en router.js
const auth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login')    //return res.sendStatus(401);
  next();
}

const auth2 = (req, res, next) => {
  if (req.session.user) return res.redirect('/')    //return res.sendStatus(401);
  next();
}

const autorizacion = (rol) => {
  return (req, res, next) => {
    console.log(req.user)
    let roles = ["USER", "INVESTOR", "ENTREPRENEUR", "ADMIN"]
    if (req.user.rol == 'ADMIN') return next();
    if (req.user.rol == 'ENTREPRENEUR' && rol != "ADMIN") return next();
    if (req.user.rol == 'INVESTOR' && rol != "ADMIN" && rol != "ENTREPRENEUR") return next();
    if (req.user.rol != rol) return res.status(403).send('No tiene privilegios suficientes para acceder al recurso');
    next();
  }
}

//RUTAS
router.get('/', auth, passportCall('jwt'), autorizacion('USUARIO'), async (req, res) => {
  res.status(200).render('home', {
    style: 'main.css',
    name: req.session.user.name,
  });
});
// router.get('/', auth, async (req, res) => {
//   res.status(200).render('home', {
//     estilos: 'main.css',
//     name: req.session.user.name,
//   });
// });


router.get('/register', auth2, (req, res) => {
  res.status(200).render('register', {
    style: 'main.css',
  })
})

router.get('/registerProject', /* auth2 ,*/ (req, res) => {
  res.status(200).render('registerProject', {
    style: 'pages/registerProject.css',
    // style: 'pages/registerProject.css',
  })
})

router.get('/login', /* auth2, */(req, res) => {
  res.status(200).render('login', {
    style: 'main.css',
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.sendStatus(500);
    } else {
      res.send('Logout OK...!!!')
    }
  })

})


//Todo lo de abajo no tiene aplicacion alguna
/* router.get('/realtimeproyects', async (req, res) => {
  let stock = await proyectModels.find()
  let proyects = stock;
  stock ? (stock = true) : (stock = false);

  res.status(200).render('realTimeproyects', {
    title: 'Estufas San Juan',
    existenciaDeStock: stock,
    proyectos: proyects,
    estilos: 'stylesReal.css'
  });
}) */

router.get('/chat', async (req, res) => {
  let stock = await proyectsModel.find()
  let proyects = stock;
  stock ? (stock = true) : (stock = false);

  res.status(200).render('chat', {
    title: 'Chat',
    estilos: 'styles.css'
  });
});

/* router.get('/proyects', async (req, res) => {
  let paginaActual = 1;
  if (req.query.pagina) {
    paginaActual = req.query.pagina;
  }

  // let proyects=await proyectsModel.find();
  let proyects = await proyectsModel.paginate({ category: { $in: ['comida'] } }, { page: paginaActual, limit: 2, sort: { title: 1, price: -1 } });
  console.log(proyects)

  let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = proyects;


  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('proyects', {
    title: 'proyects Paginados',
    estilos: 'proyectsStyles.css',
    proyects: proyects.docs,
    totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
  });
}); */

router.get('/carts/:cid', async (req, res) => {
  let cid = req.query.cid
  let paginaActual = 1;
  if (req.query.pagina) {
    paginaActual = req.query.pagina;
  }

  // let proyects=await proyectsModel.find();
  let proyects = await proyectsModel.paginate({ category: { $in: ['comida'] } }, { page: paginaActual, limit: 2, sort: { title: 1, price: -1 } });
  console.log(proyects)

  let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = proyects;


  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('carts', {
    title: 'Carritos',
    estilos: 'proyectsStyles.css',
    cid: cid,
    proyects: proyects.docs,
    totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
  });

});
export default router; 