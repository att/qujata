import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class MessageGenerator {
    static generate(sizeInBytes: number) {
        const randomBytes = crypto.randomBytes(sizeInBytes);
        return randomBytes.toString('hex');
    }
}
