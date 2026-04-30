import { individualServices, businessServices, registrationServices, otherServices } from './servicesData';

const allServices = [
    ...individualServices,
    ...businessServices,
    ...registrationServices,
    ...otherServices
];

export const planMapping = allServices.reduce((acc, service) => {
    acc[service.id] = {
        name: service.title,
        price: service.numericPrice,
        ...(service.planId && { _id: service.planId })
    };
    return acc;
}, {});
