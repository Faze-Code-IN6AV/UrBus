import Passenger from './passenger.model.js';

export const createPassenger = async (req, res, next) => {
  try {

    if (req.user.role !== 'ADMIN_ROLE' && req.user.role !== 'DRIVER_ROLE') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para crear pasajeros'
      });
    }

    const { name, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'El userId de la cuenta es obligatorio'
      });
    }

    const existing = await Passenger.findOne({ userId, isActive: true });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un pasajero vinculado a esa cuenta'
      });
    }

    const passenger = await Passenger.create({ name, userId });

    res.status(201).json({
      success: true,
      message: 'Pasajero creado y vinculado a la cuenta',
      data: passenger
    });

  } catch (err) {
    next(err);
  }
};

export const getPassengers = async (req, res, next) => {
  try {

    if (
      req.user.role !== 'ADMIN_ROLE' &&
      req.user.role !== 'PASSENGER_ROLE' &&
      req.user.role !== 'USER_ROLE' &&
      req.user.role !== 'DRIVER_ROLE'
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver pasajeros'
      });
    }

    const passengers = await Passenger.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: passengers
    });

  } catch (err) {
    next(err);
  }
};

export const getMyPassenger = async (req, res, next) => {
  try {

    const passenger = await Passenger.findOne({ userId: req.user.id, isActive: true });

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'No tienes un perfil de pasajero vinculado'
      });
    }

    res.status(200).json({
      success: true,
      data: passenger
    });

  } catch (err) {
    next(err);
  }
};

export const updatePassengerStatus = async (req, res, next) => {
  try {

    const { id } = req.params;
    const status = req.body.status ?? req.body.data;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio'
      });
    }

    const passenger = await Passenger.findById(id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Pasajero no encontrado'
      });
    }

    if (
      (req.user.role === 'PASSENGER_ROLE' || req.user.role === 'USER_ROLE') &&
      passenger.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Solo puede actualizar su propio estado'
      });
    }

    passenger.status = status;
    await passenger.save();

    res.status(200).json({
      success: true,
      message: 'Estado actualizado',
      data: passenger
    });

  } catch (err) {
    next(err);
  }
};

export const deletePassenger = async (req, res, next) => {
  try {

    if (req.user.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para eliminar pasajeros'
      });
    }

    const { id } = req.params;

    const passenger = await Passenger.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Pasajero no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pasajero eliminado'
    });

  } catch (err) {
    next(err);
  }
};