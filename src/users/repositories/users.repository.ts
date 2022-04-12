import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { User } from "../models/user";


@Injectable()
export class UsersRepository {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async retrieve(): Promise<User[]> {
        return this.userModel.find();
    }

    async retrieveByName(name: string): Promise<User> {
        return this.userModel.findOne({ name });
    }

    async retrieveById(id: string) {
        return this.userModel.findById(id);
    }

    async update(id: string, changes: Partial<User>): Promise<User> {
        return this.userModel.findOneAndUpdate({ _id: id }, changes, { new: true }); // new true returns the updated database version of the object 
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = new this.userModel(user);
        await newUser.save();
        return newUser.toObject({ versionKey: false }); // versionKey false avoids internal mongoose properties used to track versions of the object
    }
}

