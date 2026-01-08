import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // --- REGISTER ---
  async register(data: { email: string; password: string; name: string; phone: string; role: UserRole; city?: string; vendor_type?: string }) {
    // 1. Check if email exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictException('Email already in use');

    // 2. Check if phone exists
    const existingPhone = await this.prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) throw new ConflictException('Phone number already in use');

    // 2. Hash Password (bcrypt)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create User in Transaction (Safely create Profile if Vendor)
    const result = await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          name: data.name,
          phone: data.phone,
          role: data.role,
        },
      });

      // If User is a VENDOR, create their profile immediately
      if (data.role === UserRole.VENDOR) {
        await prisma.vendorProfile.create({
          data: {
            user_id: user.id,
            city: data.city || 'Lahore', // Default to Lahore per SRS single city scope
            vendor_type: data.vendor_type || 'Individual',
          },
        });
      }

      return user;
    });

    return { message: 'User registered successfully', userId: result.id };
  }

  // --- LOGIN ---
  async login(data: { email: string; password: string }) {
    // 1. Find User
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Check Password
    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate Token
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }
}