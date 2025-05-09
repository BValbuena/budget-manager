const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener solo opciones activas
exports.getActiveOptions = async (req, res) => {
  try {
    const options = await prisma.option.findMany({
      where: { active: true },
      include: { category: true }
    });
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener opciones activas' });
  }
};

// Crear nueva opción
exports.createOption = async (req, res) => {
  try {
    const { name, priceEuro, hours, description, active, categoryId } = req.body;
    const option = await prisma.option.create({
      data: {
        name,
        priceEuro,
        hours,
        description,
        active,
        category: {
          connect: { id: parseInt(categoryId) }
        }
      }
    });
    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear opción' });
  }
};

// Actualizar opción
exports.updateOption = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priceEuro, hours, description, active, categoryId } = req.body;

    const updated = await prisma.option.update({
      where: { id: parseInt(id) },
      data: {
        name,
        priceEuro,
        hours,
        description,
        active,
        category: {
          connect: { id: parseInt(categoryId) }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar opción' });
  }
};

// Eliminar opción
exports.deleteOption = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.option.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Opción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar opción' });
  }
};
