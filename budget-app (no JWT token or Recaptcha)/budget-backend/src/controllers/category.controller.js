const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las categorías con sus opciones
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { options: true },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener solo categorías con opciones activas
exports.getCategoriesWithActiveOptions = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        options: {
          where: { active: true }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);
    res.status(500).json({ message: 'Error al obtener datos' });
  }
};

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
      include: { options: true },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Eliminar una categoría (y sus opciones)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.option.deleteMany({ where: { categoryId: parseInt(id) } });
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
