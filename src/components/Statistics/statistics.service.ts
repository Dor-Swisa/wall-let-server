import { Get, Injectable, Param, Post } from '@nestjs/common';
import { RequestService } from '../Requests/request.service';
import { QuestionService } from '../Question/question.service';
import { QuestionDto } from '../Question/dto/question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Business } from '../Business/business.model';
import { UserService } from '../Users/user.service';
import { User } from '../Users/user.model';

@Injectable()
export class StatisticsService {
  constructor(private _userService: UserService,private _requestService: RequestService) {
  }


  async GetMonthlyBalance(email:string):Promise<number>{
    const user:User = await this._userService.getUserByEmail(email);
    const spent:number = await this._requestService.howMuchISpentThisMonth(email);

    return  user.myTarget - spent ;

    }

}