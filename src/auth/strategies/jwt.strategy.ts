
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUser } from "./../../utils/interfaces/auth";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    validate(payload: any) {
        return payload.user;
    }
}  