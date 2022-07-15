import { validate } from 'uuid';

export const isValidID = (id: string) => {
  return validate(id);
};
