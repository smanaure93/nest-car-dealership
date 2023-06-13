import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICar } from './interfaces/cars.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  private cars: ICar[] = [];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find((car: ICar) => car.id === id);
    if (!car) throw new NotFoundException(`Car with id: ${id} not found`);
    return car;
  }

  create(createCarDto: CreateCarDto) {
    const { brand, model } = createCarDto;
    const carFounded = this.cars.find(
      (car: ICar) =>
        car.brand.toLowerCase() === brand.toLowerCase() &&
        car.model.toLowerCase() === model.toLowerCase(),
    );
    if (carFounded)
      throw new BadRequestException(`Car ${brand} - ${model} already exist!`);
    const car = {
      id: uuid(),
      brand,
      model,
    };
    this.cars.push(car);
    return car;
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    const { brand, model } = updateCarDto;

    const carExists = this.cars.find(
      (car: ICar) =>
        car.brand.toLowerCase() === brand.toLowerCase() &&
        car.model.toLowerCase() === model.toLowerCase(),
    );
    if (carExists)
      throw new BadRequestException(`Car ${brand} - ${model} already exist!`);

    let carDB = this.findOneById(id);
    this.cars = this.cars.map((car) => {
      if (car.id === carDB.id) {
        carDB = { ...carDB, ...updateCarDto, id };
        return carDB;
      }
      return car;
    });
    return carDB;
  }

  delete(id: string) {
    const carDB = this.findOneById(id);
    this.cars.splice(this.cars.indexOf(carDB), 1);
    return carDB;
  }

  fillCarsWithSeedData(cars: ICar[]) {
    this.cars = cars;
  }
}
