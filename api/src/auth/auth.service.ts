import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomInt } from 'crypto';
import { Resend } from 'resend';

import { PrismaService } from '../prisma/prisma.service';

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 45 * 1000;
const MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth');
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private hashCode(code: string) {
    return createHash('sha256').update(`${code}:${process.env.JWT_SECRET}`).digest('hex');
  }

  async requestCode(rawEmail: string) {
    const email = rawEmail.trim().toLowerCase();

    const recent = await this.prisma.otpCode.findFirst({
      where: { email, createdAt: { gte: new Date(Date.now() - RESEND_COOLDOWN_MS) } },
    });
    if (recent) {
      throw new HttpException('Espere um pouquinho antes de pedir outro código 🌿', HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = String(randomInt(1_000_000)).padStart(6, '0');
    await this.prisma.otpCode.create({
      data: { email, codeHash: this.hashCode(code), expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    });

    await this.sendCodeEmail(email, code);
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`Código para ${email}: ${code}`);
    }

    return { ok: true };
  }

  async verify(rawEmail: string, code: string) {
    const email = rawEmail.trim().toLowerCase();

    const otp = await this.prisma.otpCode.findFirst({
      where: { email, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) {
      throw new UnauthorizedException('Código inválido ou expirado.');
    }
    if (otp.attempts >= MAX_ATTEMPTS) {
      await this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
      throw new UnauthorizedException('Muitas tentativas. Peça um novo código.');
    }
    if (otp.codeHash !== this.hashCode(code)) {
      await this.prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      throw new UnauthorizedException('Código inválido.');
    }

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    const existing = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    const isNew = !existing;
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true, email: true, dailyGoalKcal: true },
    });

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { token, user, isNew };
  }

  private async sendCodeEmail(email: string, code: string) {
    try {
      await this.resend.emails.send({
        from: 'Tico <onboarding@resend.dev>',
        to: email,
        subject: 'Seu código do Tico 🐿️',
        html: `<div style="font-family: system-ui, sans-serif; color: #2B2119;">
  <p>Oi! Seu código de acesso ao Tico é:</p>
  <p style="font-size: 30px; font-weight: 800; letter-spacing: 6px; color: #FC6C26;">${code}</p>
  <p style="color: #8A7B6B;">Vale por 10 minutos. Se não foi você, pode ignorar 🌿</p>
</div>`,
      });
    } catch (error) {
      this.logger.error('Falha ao enviar o e-mail do código', error as Error);
    }
  }
}
