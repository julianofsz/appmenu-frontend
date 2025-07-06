export interface Category {
  _id: string; // MongoDB usa _id
  id: string; // Mongoose geralmente cria um 'id' virtual
  nome: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string; 
}