import {
  ParseUUIDPipe,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  @Get()
  getAllCars() {
    return this.carsService.findAll();
  }

  @Get(':id')
  getCarById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.carsService.findOneById(id);
  }

  @Post()
  createCar(@Body() createCarDto: CreateCarDto) {
    const car = this.carsService.create(createCarDto);
    return {
      ok: true,
      method: 'POST',
      car,
    };
  }

  @Patch(':id')
  updateCar(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    const car = this.carsService.update(id, updateCarDto);
    return {
      ok: true,
      method: 'PATCH',
      car,
    };
  }

  @Delete(':id')
  deleteCar(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const car = this.carsService.delete(id);
    return {
      ok: true,
      method: 'DELETE',
      car,
    };
  }
}
