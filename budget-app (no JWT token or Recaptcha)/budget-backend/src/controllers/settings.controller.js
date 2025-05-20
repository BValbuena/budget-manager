const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener el precio por hora
exports.getHourlyRate = async (req, res) => {
  try {
    let setting = await prisma.setting.findUnique({ where: { id: 1 } });
    if (!setting) {
      setting = await prisma.setting.create({
        data: { id: 1, hourlyRate: 60 }
      });
    }
    res.json({ hourlyRate: setting.hourlyRate });
  } catch (err) {
    console.error("Error al obtener hourlyRate:", err);
    res.status(500).json({ error: "Error al obtener el precio por hora" });
  }
};


// Actualizar el precio por hora
exports.updateHourlyRate = async (req, res) => {
  try {
    const { hourlyRate } = req.body;
    if (!hourlyRate || isNaN(hourlyRate)) {
      return res.status(400).json({ error: 'hourlyRate inválido' });
    }

    const updated = await prisma.setting.upsert({
      where: { id: 1 },
      update: { hourlyRate: parseFloat(hourlyRate) },
      create: { id: 1, hourlyRate: parseFloat(hourlyRate) }
    });

    res.json({ message: 'Precio por hora actualizado', hourlyRate: updated.hourlyRate });
  } catch (err) {
    console.error('Error al actualizar hourlyRate:', err);
    res.status(500).json({ error: 'Error al actualizar el precio por hora' });
  }
};
