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

  // --- REGISTER (Unified - Always CLIENT) ---
  async register(data: { email: string; password: string; name: string }) {
    // 1. Check if email exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictException('Email already in use');

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create User as CLIENT (Unified Account Architecture)
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        role: UserRole.CLIENT, // Always CLIENT on registration
      },
    });

    // 4. Auto-login: Generate token immediately
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: 'Registration successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        vendorStatus: 'NONE', // New user has no vendor application
      },
    };
  }

  // --- LOGIN (Returns vendor status for UI decisions) ---
  async login(data: { email: string; password: string }) {
    // 1. Find User AND include Vendor Profile
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { vendor_profile: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Check Password
    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Determine vendor status: NONE, PENDING, APPROVED, or REJECTED
    let vendorStatus = 'NONE';
    if (user.vendor_profile) {
      vendorStatus = user.vendor_profile.approval_status;
    }

    // 4. Generate Token (No blocking - all users can login)
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        vendorStatus, // For frontend UI decisions
        vendorType: user.vendor_profile?.vendor_type,
      },
    };
  }

  // --- GET CURRENT USER (For token refresh/validation) ---
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { vendor_profile: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    let vendorStatus = 'NONE';
    if (user.vendor_profile) {
      vendorStatus = user.vendor_profile.approval_status;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorStatus,
      vendorType: user.vendor_profile?.vendor_type,
    };
  }
}