const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPlan = async (req, res) => {
  try {
    const { budget, totalCost, totalHours, selectedOptionIds } = req.body;

    const plan = await prisma.plan.create({
      data: {
        budget,
        totalCost,
        totalHours,
        planOptions: {
          create: selectedOptionIds.map((optionId) => ({
            option: { connect: { id: optionId } }
          }))
        }
      }
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el plan' });
  }
};
