// BikeService.ts
export interface Bike {
  id: number;
  model: string;
  imageSource: string;
  stock: number;
  details: string;
  electric: boolean;
  price: number;
}

export class BikeService {
  private apiUrl = 'http://localhost:8080/bikes';

  constructor(apiUrl?: string) {
    if (apiUrl) {
      this.apiUrl = apiUrl;
    }
  }

  // Fetch bikes from backend
  getBikes(): Promise<Bike[]> {
    return fetch(this.apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch bikes: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Bike[]) => data);
  }
}
