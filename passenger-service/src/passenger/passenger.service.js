import Passenger from './passenger.model.js';

export const createPassengerService = async(data) => {

    const passenger = new Passenger(data);
    await passenger.save();

    return passenger;
};

export const getPassengersService = async(busId) => {

    return await Passenger.find({
        busId,
        active: true
    });

};


export const updatePassengerStatusService = async(userId, status) => {

    const passenger = await Passenger.findOne({
        userId,
        active: true
    });

    if(!passenger){
        throw new Error('Pasajero no encontrado');
    }

    passenger.status = status;

    await passenger.save();

    return passenger;
};

export const deletePassengerService = async(id) => {

    const passenger = await Passenger.findById(id);

    if(!passenger){
        throw new Error('Pasajero no encontrado');
    }

    passenger.active = false;

    await passenger.save();

    return passenger;
};