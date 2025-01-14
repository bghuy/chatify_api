import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerService {

    async fetchServerByUserId(userId: string | number){
        return "oke"
    }
}
