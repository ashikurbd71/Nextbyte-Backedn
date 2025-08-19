import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from './admin.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor(private adminService: AdminService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const admin = await this.adminService.findOne(payload.sub);
        if (!admin || !admin.isActive) {
            return null;
        }
        return {
            id: admin.id,
            email: admin.email,
            role: admin.role
        };
    }
}
