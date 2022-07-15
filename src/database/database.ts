interface entityWithID {
  id?: string;
}

export class DATABASE<T extends entityWithID> {
  private DB: T[] = [];
  private readonly entity: new (data: T) => T;

  constructor(entity: new (data: T) => T) {
    this.entity = entity;
  }

  async findAll(): Promise<T[]> {
    return new Promise((resolve) => {
      resolve(this.DB.map((data) => data));
    });
  }

  async findByID(id: string): Promise<T | undefined> {
    return new Promise((resolve) => {
      resolve(this.DB.find((entity) => entity.id === id));
    });
  }

  async create(data: T): Promise<T> {
    return new Promise((resolve) => {
      const newEnt = new this.entity(data);
      this.DB.push(newEnt);
      resolve(newEnt);
    });
  }

  async update(id: string, data: T): Promise<T> {
    return new Promise((resolve) => {
      const newEnt = new this.entity(data);
      this.DB = this.DB.map((ent) => (ent.id === id ? newEnt : ent));
      resolve(newEnt);
    });
  }

  async remove(id: string): Promise<number> {
    return new Promise((resolve) => {
      const deleteIndex = this.DB.findIndex((entity) => entity.id === id);
      this.DB.splice(deleteIndex, 1);
      resolve(deleteIndex);
    });
  }
}
