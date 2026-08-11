const { Medication, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get medications list
 */
const getMedications = async (req, res, next) => {
  try {
    const { category, low_stock } = req.query;
    let whereClause = {};

    if (category) whereClause.category = category;
    if (low_stock === 'true') {
      whereClause.stock_quantity = { [Op.lte]: sequelize.col('reorder_level') };
    }

    const medications = await Medication.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      data: medications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get low stock alerts
 */
const getLowStockAlerts = async (req, res, next) => {
  try {
    const lowStockMeds = await Medication.findAll({
      where: {
        stock_quantity: { [Op.lte]: sequelize.col('reorder_level') },
      },
      order: [['stock_quantity', 'ASC']],
    });

    res.json({
      success: true,
      count: lowStockMeds.length,
      data: lowStockMeds,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new medication
 */
const createMedication = async (req, res, next) => {
  try {
    const { name, generic_name, category, stock_quantity, unit_price, reorder_level, supplier } = req.body;

    if (!name || unit_price === undefined) {
      return res.status(400).json({ success: false, message: 'Medication name and unit price are required.' });
    }

    const medication = await Medication.create({
      name,
      generic_name,
      category,
      stock_quantity: stock_quantity || 0,
      unit_price: unit_price || 0.00,
      reorder_level: reorder_level || 10,
      supplier,
    });

    res.status(201).json({
      success: true,
      message: 'Medication added to inventory successfully.',
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update medication stock / details
 */
const updateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found.' });
    }

    const { name, generic_name, category, stock_quantity, unit_price, reorder_level, supplier } = req.body;

    if (name) medication.name = name;
    if (generic_name !== undefined) medication.generic_name = generic_name;
    if (category !== undefined) medication.category = category;
    if (stock_quantity !== undefined) medication.stock_quantity = stock_quantity;
    if (unit_price !== undefined) medication.unit_price = unit_price;
    if (reorder_level !== undefined) medication.reorder_level = reorder_level;
    if (supplier !== undefined) medication.supplier = supplier;

    await medication.save();

    res.json({
      success: true,
      message: 'Medication inventory updated successfully.',
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete medication
 */
const deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found.' });
    }

    await medication.destroy();

    res.json({
      success: true,
      message: 'Medication removed from inventory.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedications,
  getLowStockAlerts,
  createMedication,
  updateMedication,
  deleteMedication,
};
