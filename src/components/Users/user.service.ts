import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { Model } from 'mongoose';
import { UserDto, WalletMemberDto } from './dto/user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel('User') private readonly _userModel: Model<User>) {
  }

  async insertUser(userDto: UserDto):Promise<User> {
    try {
      const newUser = new this._userModel(userDto);
      const result = await newUser.save();
      return result;
    } catch (e) {
      throw new NotFoundException('The Users were not insert correctly ');
    }
  }


  async getUserById(userId: string): Promise<User> {
    let user;
    try {
      user = await this._userModel.findById(userId).exec();
    } catch (e) {
      throw new NotFoundException(e);
    }
    if (!user) {
      throw new NotFoundException('could not find user');
    }

    return user._doc;
  }

  async getUsers() {
    const users = await this._userModel.find().exec();
    return users;
  }

  async getUserByPassword(userEmail: string, userPassword: string): Promise<User> {
    const user = await this._userModel.findOne({ 'email': userEmail, 'password': userPassword }).exec();
    if (!user) {
      throw new NotFoundException('The Email or Password are incorrect');
    }
    return user;
  }

  async isPasswordAnswerCorrect(email: string, answer: string) {
    let user;
    try {
      user = await this._userModel.findOne({email:email}).exec();
      if (user.answerPassword == answer) {
        return true;
      }
      return false;
    } catch (e) {
      throw new NotFoundException('could not find user');
    }
  }

  async updatePassword(email: string, newPassword: string){
    const user:User = await this._userModel.findOne({email:email}).exec();
    user.password = newPassword;
    await user.save();
    return "Password updated successfully"
  }

  async updateUser(walletMemberDto: WalletMemberDto): Promise<User> {
    try {
      const updateUser = await this._userModel.findById(walletMemberDto.id).exec();
      if (walletMemberDto.maritalStatus) {
        updateUser.maritalStatus = walletMemberDto.maritalStatus;
      }
      if (walletMemberDto.walletMember) {
        updateUser.walletMember = walletMemberDto.walletMember;
        if (!updateUser.stripeCardId) {
          // Move after this will be a real stripe account.
          //walletMemberDto.stripeCardId = await stripeData.creatPrepaidCreditCard(updateUser);
          walletMemberDto.stripeCardId = 'tok_mastercard_prepaid';
        }
      }
      if (walletMemberDto.addictedStatus) {
        updateUser.addictedStatus = walletMemberDto.addictedStatus;
      }
      if (walletMemberDto.myTarget) {
        updateUser.myTarget = walletMemberDto.myTarget;
      }
      if (walletMemberDto.myFixedIncomes) {
        updateUser.myFixedIncomes = walletMemberDto.myFixedIncomes;
      }
      if (walletMemberDto.myFixedExpenses) {
        updateUser.myFixedExpenses = walletMemberDto.myFixedExpenses;
      }
      if (walletMemberDto.creditCardId) {
        updateUser.creditCardId = walletMemberDto.creditCardId;
      }
      if (walletMemberDto.stripeCardId) {
        updateUser.stripeCardId = walletMemberDto.stripeCardId;
      }
      await updateUser.save();
      return updateUser;
    } catch (e) {
      throw new NotFoundException('The Users were not update');
    }
  }

  async addWalletFriend(userId:string,friendEmail:string){
    let friendUser;
    try {
     friendUser =  await this.getUserByEmail(friendEmail);
    }catch (e) {
      throw new NotFoundException('The Friend user were not found');

    }
     const user:User = await this._userModel.findById(userId).exec();
     user.myWalletMembers.push(friendEmail);
     await user.save();
     return friendUser.email;
  }

  async getUsersByEmails(emails: string[]): Promise<any> {
    try {
      return await this._userModel.find({ 'email': { $in: emails } }).exec();
    } catch (e) {
      throw new NotFoundException('The Users were not found');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this._userModel.findOne({ 'email': email });
      return user;
    }catch (e) {
      throw new NotFoundException('The User were not found');
    }
  }
}





