import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from './../decorators/roles.decorator';
import { JwtGuard } from './../guards/jwt.guard';
import { LocalGuard } from './../guards/local.guard';
import { RefreshTokenGuard } from './../guards/refresh-token.guard';
import { RoleGuard } from './../guards/role.guard';
import { AuthService } from './auth.service';
import { signToken } from './../utils/jwt';
import { ErrorType } from './../utils/error';
import { UserRegisterDto } from './../dtos/user/UserRegisterDto';
import { GoogleGuard } from './../guards/google.guard';
import { CustomRequest } from './../utils/interfaces/request';
import { PrismaService } from './../prisma/prisma.service';
import { AuthenticatedUserType } from 'src/utils/types/auth';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) { }

    @Get('status')
    @Roles(['ADMIN'])
    @UseGuards(JwtGuard, RoleGuard)
    status(@Req() req: Request) {
        return req.user;
    }

    @Get('profile')
    @UseGuards(JwtGuard)
    async getProfile(@Req() req: Request) {
        try {
            const profile = await this.authService.fetchUserProfile((req.user as AuthenticatedUserType)?.id)
            return { message: 'Refresh token successful', data:  {profile} }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorType.SERVER_INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('refresh-token')
    @UseGuards(RefreshTokenGuard)
    refreshToken(@Req() req: Request, @Res() res: Response) {
        const access_token = signToken({user: req.user}, process.env.JWT_SECRET, process.env.ACCESS_TOKEN_EXPIRY);
        if(!access_token) throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        return res.json({ message: 'Refresh token successful', data:  {access_token} });
    }

    @Get('check-auth')
    @UseGuards(JwtGuard)
    async checkAuth(@Req() req: CustomRequest, @Res() res: Response) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: req.user.email
                }
            })
            if(!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            return res.json({ message: 'User is authenticated', data: {isAuthenticated: !!user} });
        } catch (error) {
            throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request , @Res({ passthrough: true }) res: Response) {
        const {access_token, refresh_token} = req.user as {access_token: string, refresh_token: string};
        const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY || '0', 10);
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.SERVER_MODE === 'production',
            maxAge: refreshTokenExpiry || sevenDaysInMs,
            sameSite: process.env.SERVER_MODE === 'production' ? 'none' : 'lax',
        });

        return {
            message: 'Login successful',
            data: { access_token }
        };
    } 
    @Post('register')
    @UsePipes(ValidationPipe)
    async registerUser (@Body() newUserData: UserRegisterDto, @Res() res: Response) {
        const {email, password} = newUserData;
        const user = await this.authService.registerUser({email, password});
        if(!user) throw new HttpException(ErrorType.SERVER_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        return res.json({ message: 'User registered successfully' });
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    logout(@Res({passthrough: true}) res: Response) {
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        return { message: 'Logout successful'};
    }

    @Get('google/login')
    @UseGuards(GoogleGuard)
    handleGoogleLogin() {
        return "oke"
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    handleGoogleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const {access_token, refresh_token} = req.user as {access_token: string, refresh_token: string};
        const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY || '0', 10);
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: refreshTokenExpiry || sevenDaysInMs,
            secure: process.env.SERVER_MODE === 'production',
            sameSite: 'none'
        });
        return { 
            message: 'Login successful', 
            data: {access_token} 
        };
    }

    @Get('test-cookie')
    testCookie(@Res({ passthrough: true }) res: Response) {
        const cookieValue = "test cookie";
        res.cookie('test_cookie', cookieValue, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.SERVER_MODE === 'production',
            sameSite: 'none',
        });
        return { 
            message: 'Cookie value', 
            data: {cookieValue} 
        };
    }


}
