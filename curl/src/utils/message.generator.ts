import {Injectable} from '@nestjs/common';

@Injectable()
export class MessageGenerator {
    static generate(sizeInBytes: number) {
        // Generate the string by repeating the character 'a'
        return 'a'.repeat(sizeInBytes);    }

}
