import { Router } from 'express';
// DEBO CAMBIARLO A proyectManagerDB.js . Pero por el momento no me anda asi que lo dejamos así.
import { projectsModel } from '../dao/models/projects.models.js';
// import { MiRouter } from './layout/router.js'
import session from 'express-session';
import { passportCall } from '../utils/jwt.utils.js';
import { usersModel } from '../dao/models/users.models.js';



const router = Router();
// const pm = new proyectManager();

//Autorizacion
//A todo esto lo debo de incluir en router.js
const auth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login')
  next();
}

const auth2 = (req, res, next) => {
  if (req.session.user) return res.redirect('/')    //return res.sendStatus(401);
  next();
}

const autorizacion = (rol) => {
  return (req, res, next) => {
    console.log(req.user)
    // let roles = ["USER", "INVESTOR", "ENTREPRENEUR", "ADMIN"]
    if (req.user.rol == 'ADMIN') return next();
    if (req.user.rol == 'ENTREPRENEUR' && rol != "ADMIN") return next();
    if (req.user.rol == 'INVESTOR' && rol != "ADMIN" && rol != "ENTREPRENEUR") return next();
    if (req.user.rol != rol) return res.status(403).redirect('/error', message = "No tiene los privilegios necesarios");
    next();
  }
}
//RUTAS
router.get('/', passportCall('jwt'), autorizacion('USUARIO'), async (req, res) => {
  console.log(req.user);
  console.log(req.user.rol);
  let footer = true
  let header = true
  let isAdmin = false
  if (req.user.rol == 'ADMIN') {
    isAdmin = true
    console.log("ENTRE");
  }
  try {
    const projects = await projectsModel.find()
    res.status(200).render('home', {
      style: 'main.css',
      name: req.user.name,
      isAdmin,
      projects,
      header,
      footer
    });
  } catch (err) {

  }
});

router.get('/register', (req, res) => {
  res.status(200).render('register', {
    style: 'main.css',
  })
})

router.get('/project/:id', async (req, res) => {
  let footer = true
  let header = true
  console.log("Estoy en el Get");
  try {
    const projectId = req.params.id;
    const project = await projectsModel.findById(projectId);

    if (!project) {
      return res.status(404).render('error', {
        message: 'Proyecto no encontrado',
        style: 'pages/error.css',
      });
    }
    const owner = await usersModel.findById(project.owner)
    res.status(200).render('project', {
      style: 'main.css',
      title: "Project",
      project: project,
      owner,
      header,
      footer
    });
  } catch (error) {
    console.error('Error al obtener datos del proyecto:', error);
    res.status(500).render('error', {
      message: 'Error interno del servidor',
      style: 'pages/error.css',
    });
  }
});

router.get('/user/:id', async (req, res) => {
  let footer = true
  let header = true
  console.log("Estoy en el Get");
  try {
    const userId = req.params.id;
    const user = await usersModel.findById(userId)

    let projects = []
    console.log(user.projects);
    for (let i = 0; i < user.projects.length; i++) {
      const project = await projectsModel.findById(user.projects[i]);
      projects.push(project)
    }

    if (!user) {
      return res.status(404).render('error', {
        message: 'Usuario no encontrado',
        style: 'pages/error.css',
      });
    }

    res.status(200).render('user', {
      style: 'main.css',
      title: "Project",
      projects,
      user,
      header,
      footer
    });
  } catch (error) {
    console.error('Error al obtener datos del proyecto:', error);
    res.status(500).render('error', {
      message: 'Error interno del servidor',
      style: 'pages/error.css',
    });
  }
});

router.get('/error', (req, res) => {
  res.status(200).render('error', {
    style: 'error.css',
    message
  })
})


router.get('/registerProject', /* auth2 ,*/(req, res) => {
  let footer = true
  let header = true
  res.status(200).render('registerProject', {
    style: 'pages/registerProject.css',
    header,
    footer
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

// Middleware para manejar errores
router.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.log("Esta trabajando el middleware pa. Descuida ya nos encargamos nosotros");
  // Loguea el error para referencia
  console.error(err);

  // Redirige a la página de error
  res.status(500).redirect('/error');
});

export default router; 