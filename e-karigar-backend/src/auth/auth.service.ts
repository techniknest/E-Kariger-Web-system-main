import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, VendorVerificationStatus } from '@prisma/client'; // Import Enum

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

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Create User (Transaction)
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

      // SRS Req: Capture Vendor Details
      if (data.role === UserRole.VENDOR) {
        await prisma.vendorProfile.create({
          data: {
            user_id: user.id,
            city: data.city || 'Lahore', // SRS Scope: Single City 
            vendor_type: data.vendor_type || 'INDIVIDUAL', // SRS Req: Ind/Team/Company 
            approval_status: VendorVerificationStatus.PENDING, // Default status
          },
        });
      }

      return user;
    });

    return { message: 'User registered successfully', userId: result.id };
  }

  // --- LOGIN ---
  async login(data: { email: string; password: string }) {
    // 1. Find User AND include Vendor Profile
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { vendor_profile: true }, // Required to check approval status
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Check Password
    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. SRS ENFORCEMENT: Block Unapproved Vendors 
    if (user.role === UserRole.VENDOR) {
      // If profile is missing OR status is not APPROVED, block them
      if (!user.vendor_profile || user.vendor_profile.approval_status !== VendorVerificationStatus.APPROVED) {
        throw new UnauthorizedException(
          'Your account is pending Admin Approval. Please wait for verification.'
        );
      }
    }

    // 4. Generate Token
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        // Send vendor type to frontend for UI adjustments
        vendorType: user.vendor_profile?.vendor_type, 
      },
    };
  }
}