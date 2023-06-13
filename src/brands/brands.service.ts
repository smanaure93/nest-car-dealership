import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [];
  create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;
    const carFounded = this.brands.find(
      (car) => car.name.toLowerCase() === name.toLowerCase(),
    );
    if (carFounded)
      throw new BadRequestException(`Brand ${name} already exist!`);
    const brand = {
      id: uuid(),
      name,
      createdAt: new Date().getTime(),
    };
    this.brands.push(brand);
    return brand;
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find((brand) => brand.id === id);
    if (!brand) throw new NotFoundException(`Brand with id: ${id} not found`);
    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    const { name } = updateBrandDto;

    const brandExists = this.brands.find(
      (brand) => brand.name.toLowerCase() === name.toLowerCase(),
    );
    if (brandExists) throw new BadRequestException(`Brand ${name}`);

    let brandDB = this.findOne(id);
    this.brands = this.brands.map((brand) => {
      if (brand.id === brandDB.id) {
        brandDB = { ...brandDB, ...updateBrandDto, id };
        return brandDB;
      }
      return brand;
    });
    return brandDB;
  }

  remove(id: string) {
    const brandDB = this.findOne(id);
    this.brands.splice(this.brands.indexOf(brandDB), 1);
    return brandDB;
  }

  fillBrandsWithSeedData(brands: Brand[]) {
    this.brands = brands;
  }
}
