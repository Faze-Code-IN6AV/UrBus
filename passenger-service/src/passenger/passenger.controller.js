import Passenger from './passenger.model.js';

export const createPassenger = async (req, res, next) => {
  try {

    if (req.user.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para crear pasajeros'
      });
    }

    const passenger = await Passenger.create({
      name: req.body.name,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Pasajero creado',
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



export const updatePassengerStatus = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const passenger = await Passenger.findById(id);

    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Pasajero no encontrado'
      });
    }

    if (
      req.user.role === 'PASSENGER_ROLE' &&
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