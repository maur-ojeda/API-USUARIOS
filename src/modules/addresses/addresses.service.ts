import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Address } from '../../entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async findByUserId(userId: string): Promise<Address[]> {
    return this.addressesRepository.find({
      where: { userId },
    });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressesRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async create(userId: string, createData: Partial<Address>): Promise<Address> {
    if (createData.isMain) {
      await this.addressesRepository.update(
        { userId, isMain: true },
        { isMain: false },
      );
    }

    const address = this.addressesRepository.create({
      ...createData,
      userId,
    });
    return this.addressesRepository.save(address);
  }

  async update(id: string, updateData: Partial<Address>): Promise<Address> {
    const address = await this.findOne(id);

    if (updateData.isMain) {
      await this.addressesRepository.update(
        { userId: address.userId, isMain: true, id: Not(id) },
        { isMain: false },
      );
    }

    Object.assign(address, updateData);
    return this.addressesRepository.save(address);
  }

  async remove(id: string): Promise<void> {
    const address = await this.findOne(id);
    await this.addressesRepository.remove(address);
  }
}
