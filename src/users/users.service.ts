import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDetailsInput } from './dto/update-details.input';
import { Id } from 'src/models/update.model';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create(createUserInput);
      return this.usersRepository.save(newUser);
    } catch (err) {
      throw err
    }
}

  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (err) {
      throw err
    }
  }

  async findOne(id: number): Promise<User> {
    try {
    const user = this.usersRepository.findOne(id);
    return user;
  }
    catch (err) {
      throw err
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {

      const user = await this.usersRepository.findOne({ email });
      return user;

    } catch(err) {
      throw err
    }
  }


  async updateUser(id: number, updateUserInput: UpdateUserInput | UpdateDetailsInput): Promise<User> {
    try {
      const updatedUser = await this.usersRepository.preload({id: id, ...updateUserInput})
      return this.usersRepository.save(updatedUser)
    } catch (err) {
      throw err
    }
  }

  async removeUser(id: number): Promise<Id> {
    try {
      const removedUser = await this.findOne(id);
      await this.usersRepository.remove(removedUser);
      return {
        id: id,
      }
    } catch (err) {
      throw err
    }
  }
}
