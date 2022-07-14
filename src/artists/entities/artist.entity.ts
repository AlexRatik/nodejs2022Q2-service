export class Artist {
  id: string;
  name: string;
  grammy: boolean;
  constructor(entity: Partial<Artist>) {
    Object.assign(this, entity);
  }
}
