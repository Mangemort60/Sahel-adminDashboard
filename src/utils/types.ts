export interface User {
  id: string | number;
  name: string;
  firstName: string;
  shortId: string;
}

export interface Reservation {
  id: string;
  createdAt: string;
  reservationType: string;
  shortId: string;
  name: string;
  firstName: string;
  chatStatus: boolean;
  bookingFormData: {
    address: string;
    address2?: string;
    city: string;
    phone: string;
    specialInstructions?: string;
  };
  email: string;
  serviceStatus: string;
  quote: number;
  serviceDate: string;
  formData: {
    fruitBasketSelected: boolean;
  };
  keyReceived?: boolean;
  agent?: string;
}

export const StatusChoices = [
  { id: 'à venir', name: 'à venir' },
  { id: 'en cours', name: 'en cours' },
  { id: 'suspendue', name: 'suspendue' },
  { id: 'terminée', name: 'terminée' },
];
