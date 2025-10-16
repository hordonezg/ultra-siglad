import express from 'express';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserLogs 
} from '../controllers/userController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de Administrador
router.use(verifyToken);
router.use(requireRole(['Administrador']));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/logs', getUserLogs);

export default router;